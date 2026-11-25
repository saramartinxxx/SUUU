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

import { ProviderScript } from "./script.js";

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
        iframe_script: ProviderScript.getByName(provider.script),
        iframe_allowed_hosts: provider.allowed_hosts,
        iframe_script_ms: provider.script_ms,
    }
}

export const providers = (reload) => new Promise(async resolve => {
    const key = 'source-providers';
    const source = 'https://solidcdn.saramartin0701.workers.dev/?key=providers';
    let data = await localforage.getItem(key);
    if (data && !reload) {
        data = JSON.parse(data);
        resolve(data);
    } else {
        const resp = await playlink_js.request(source);
        if (resp.status !== 200) {
            resolve([]);
            return;
        }
        const results = JSON.parse(resp.data);
        await localforage.setItem(key, JSON.stringify(results));
        resolve(results);
        if (reload) alert(`${results.length} providers has been reloaded successfully!`);
    }
});