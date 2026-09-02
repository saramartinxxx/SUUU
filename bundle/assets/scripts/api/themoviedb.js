import { generate, getRandomInt, urlToKey } from "../utils.js";

const apiKeys = ["fb7bb23f03b6994dafc674c074d01761", "e55425032d3d0f371fc776f302e7c09b", "8301a21598f8b45668d5711a814f01f6", "8cf43ad9c085135b9479ad5cf6bbcbda", "da63548086e399ffc910fbc08526df05", "13e53ff644a8bd4ba37b3e1044ad24f3", "269890f657dddf4635473cf4cf456576", "a2f888b27315e62e471b2d587048f32e", "8476a7ab80ad76f0936744df0430e67c", "5622cafbfe8f8cfe358a29c53e19bba0", "ae4bd1b6fce2a5648671bfc171d15ba4", "257654f35e3dff105574f97fb4b97035", "2f4038e83265214a0dcd6ec2eb3276f5", "9e43f45f94705cc8e1d5a0400d19a7b7", "af6887753365e14160254ac7f4345dd2", "06f10fc8741a672af455421c239a1ffc", "09ad8ace66eec34302943272db0e8d2c", "87a1e3590b0d9a457aafc2335f066768", "7ec5fa8ca102e3ace8942a5f662bb94b"];

const anyApiKey = () => {
    const index = getRandomInt(0, apiKeys.length - 1);
    return apiKeys[index];
}

const withApiKey = (str) => {
    let url = `${str}`;
    if (!url.includes('api_key')) {
        const key = anyApiKey();
        url = `${url}${url.includes('?') ? `&` : `?`}api_key=${key}`;
    }
    return url;
}

const base = (path) => {
    return `https://api.themoviedb.org/3/${path ?? ""}`;
}

/**
 * 
 * @param {string} url 
 * @param {{ key?: string, filter?: any, days?: number }} props 
 * @returns 
 */
const request = async (url, props) => {
    const oneDayInMilliseconds = ((props?.days ?? 1) * 24) * 60 * 60 * 1000;
    const key = props?.key ?? urlToKey(url);

    let data = await localforage.getItem(key);

    if (data) {
        data = JSON.parse(data);
        if (data.expire && Date.now() <= data.expire) {
            return data.data;
        }
    }

    data = await (await fetch(withApiKey(url))).json();

    if (data) {
        if (props && props.filter && typeof props.filter === "function") {
            data = props.filter(data);
        }
        const expire = Date.now() + oneDayInMilliseconds;
        data = {
            expire,
            data: data,
        }
        localforage.setItem(key, JSON.stringify(data));
    }
    return data.data;
}

/**
 * @param {{ type: string, id: any }} props | return the media detail info includes credits, recommendations, similar, external_ids, images
 * @returns string
 */
const detail = (props) => {
    return base(`${props.type}/${props.id}?language=en-US&include_image_language=en-US&append_to_response=credits,recommendations,similar,external_ids,images`);
}

/**
 * 
 * @param {{ type: string, id: string, min?: number, max?: number }} params
 */
async function get_seasons(params) {
    const { type, id, min, max } = params;
    let seasons_range = [...generate(min, max)].map(e => `season/${e}`).join(",");
    let url = base(`${type}/${id}?language=en-US&append_to_response=${seasons_range}`);
    const filter = (data) => {
        Object.entries(data).forEach(entry => {
            if (!entry[0].startsWith('season/')) {
                delete data[entry[0]];
            }
        });
        return data;
    }
    const data = await request(url, { filter });
    if (data) {
        let seasons = [];
        for (let i = min; i < max; i++) {
            const season = data[`season/${i}`];
            if (season) seasons.push(season);
        }
        return seasons;
    }
}

export { apiKeys, base, request, detail, get_seasons }