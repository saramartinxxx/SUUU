import { providers, resolve_video } from "./constants/providers.js";
import { add_to_history } from "./database/history.js";
import { getPropsCache, media_key, setPropsCache } from "./utils.js";

export const sekey = (s, e) => `s${s}_e${e}`;

/**
 * 
 * @param {Object} media 
 * @param {number|undefined} season 
 * @param {number|undefined} episode 
 * @param {string|undefined} media_type 
 */
export const play_media = async (media, season, episode, media_type) => {
    const key = media_key(media);
    let position;
    let url;
    const props = (await getPropsCache(key)) || {};
    const isTV = media.name;
    if (isTV && !season && !episode) {
        season = 1;
        episode = 1;
    }
    if (isTV) {
        const childkey = sekey(season, episode);
        if (childkey in props) {
            position = props[childkey].position;
            url = props[childkey].url;
        }
    } else {
        if ('position' in props) position = props.position;
        if ('url' in props) url = props.url;
    }
    const videos = providers.map(provider => {
        return resolve_video(media, provider, season, episode, media_type, position);
    });
    if (isTV) {
        await setPropsCache(key, { season, episode });
    }
    add_to_history(media);
    playlink_js.emitter.on('iframeplayer', (e) => save_progress(key, e, season, episode));
    let index;
    if (url) {
        const uri = new URL(url);
        const videoIndex = videos.findIndex(e => (e.url.includes(uri.host) || e?.iframe_allowed_hosts?.includes(uri.host)));
        if (videoIndex !== -1) {
            index = videoIndex;
        }
    }
    playlink_js.video.play(videos, index);
}

const save_progress = async (key, info, season, episode) => {
    if (typeof info === "string") info = JSON.parse(info);
    let props = (await getPropsCache(key)) || {};
    const pos = info?.position;
    const dur = info?.duration;
    if (pos && dur) {
        if (season && episode) {
            const childkey = sekey(season, episode);
            if (childkey in (props || {})) {
                const childinfo = props[childkey];
                if (childinfo.position && pos > childinfo.position) {
                    childinfo.position = pos;
                }
                childinfo.duration = dur;
                childinfo.url = info.url;
                updateepisodeprogress(childkey, pos, dur);
                await setPropsCache(key, { [childkey]: childinfo });
            } else {
                updateepisodeprogress(childkey, pos, dur);
                await setPropsCache(key, { [childkey]: info });
            }
        } else {
            let value = { position: 0, duration: 0, url: info.url };
            if ('position' in props) {
                if (pos > props.position) {
                    value.position = pos;
                }
            } else {
                value.position = pos;
            }
            value.duration = dur;
            await setPropsCache(key, value);
        }
    }
}

const updateepisodeprogress = (childkey, pos, dur) => {
    /**@type {HTMLDivElement} progress */
    const progress = document.body.querySelector(`#progress_${childkey}`);
    progress.style.width = `${(pos / dur) * 100}%`;
    progress.parentElement.style.opacity = '100%';
}