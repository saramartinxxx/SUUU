/**
 * @typedef {{ 
 *    movie: string,
 *    tv: string,
 *    is_iframe?: boolean,
 *    script?: string,
 *    script_ms?: number,
 *    headers?: Object,
 *    allowed_hosts?: string[],
 *    default?: boolean,
 *    prefix?: string,
 * }} Provider
 */

import { generate } from "../utils.js";
import { ProviderScript } from "./script.js";

/** @type {Provider} */
const vsembed_ru = {
    movie: 'https://vsembed.ru/embed/{t}/{i}?startAt={position}',
    tv: 'https://vsembed.ru/embed/{t}/{i}/{s}-{e}?startAt={position}',
    default: true,
};

/** @type {Provider} */
const vidapi_ru = {
    movie: 'https://vaplayer.ru/embed/{t}/{i}?startAt={position}',
    tv: 'https://vaplayer.ru/embed/{t}/{i}/{s}/{e}?startAt={position}',
}

// /** @type {Provider} */
// const vidking_net = {
//     movie: 'https://www.vidking.net/embed/{t}/{i}?autoPlay=true',
//     tv: 'https://www.vidking.net/embed/{t}/{i}/{s}/{e}?autoPlay=true',
// }

/** @type {Provider} */
const vidlink_pro = {
    movie: 'https://vidlink.pro/{t}/{i}?autoplay=true&startAt={position}',
    tv: 'https://vidlink.pro/{t}/{i}/{s}/{e}?autoplay=true&startAt={position}',
    script: ProviderScript.manual,
}

/** @type {Provider} */
const vidrock_ru = {
    movie: 'https://vidrock.ru/{t}/{i}?autoplay=true&startAt={position}',
    tv: 'https://vidrock.ru/{t}/{i}/{s}/{e}?autoplay=true&startAt={position}',
    allowed_hosts: ['vidrock.ru', 'vidrock.to'],
    script: ProviderScript.manual,
}

// /** @type {Provider} */
// const rivestream_app = {
//     movie: 'https://www.rivestream.app/embed?type={t}&id={i}',
//     tv: 'https://www.rivestream.app/embed?type={t}&id={i}&season={s}&episode={e}',
// }

/** @type {Provider} */
const viduki_net = {
    movie: 'https://www.viduki.net/{v}/{t}/{i}',
    tv: 'https://www.viduki.net/{v}/{t}/{i}/{s}/{e}',
}

const onlyhost = (str) => {
    try {
        if (!/^https?:\/\//i.test(str)) str = 'https://' + str;
        const url = new URL(str);
        let domain = url.hostname;
        return domain.replace(/^www\./i, '');
    } catch (error) {
        return '';
    }
}

/**
 * Resolve provider to actual embed url.
 * @param {Object} media
 * @param {Provider} provider
 * @param {number | undefined} season
 * @param {number | undefined} episode
 * @param {string | undefined} media_type
 */
export const resolve_video = (media, provider, season, episode, media_type, position) => {
    const type = media.name ? 'tv' : 'movie';
    const id = media.id;
    let url = provider[type];
    url = url.replaceAll('{t}', media_type ?? type).replaceAll('{i}', id);
    if (season && episode) {
        url = url.replaceAll('{s}', season).replaceAll('{e}', episode);
    }
    if (position) {
        url = url.replaceAll('{position}', position);
    } else {
        url = url.replaceAll('?startAt={position}', '').replaceAll('&startAt={position}', '');
    }
    return {
        name: `${provider.prefix ?? onlyhost(url).toUpperCase()}  |  ${season && episode ? `S${season}E${episode} - ` : ''}${media.name ? media.name : media.title}`,
        url: url,
        runtime: media.runtime,
        thumbnail: `https://images.tmdb.org/t/p/w400${media.backdrop_path}`,
        is_iframe: provider.is_iframe ?? true,
        iframe_script: provider.script ?? ProviderScript.auto,
        iframe_allowed_hosts: provider.allowed_hosts,
        iframe_script_ms: provider.script_ms,
    }
}

/** @type {Provider[]} */
export const providers = [
    vsembed_ru,
    vidapi_ru,
    vidlink_pro,
    vidrock_ru,
    // vidking_net,
    // rivestream_app,
    ...[...generate(1, 4)].map(lvl => ({
        ...viduki_net,
        movie: viduki_net.movie.replace('{v}', lvl),
        tv: viduki_net.tv.replace('{v}', lvl),
        prefix: `VIDUKI.NET - API ${lvl}`,
    })),
];