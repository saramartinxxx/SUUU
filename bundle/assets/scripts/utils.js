import { providers, resolve_video } from "./constants/providers.js";

let _loggerWs;

/**
 * Used for development purpose only.
 * @type logger 
 */
const logger = (msg, host) => {
    if (typeof _loggerWs === "undefined") {
        _loggerWs = new WebSocket(host || 'ws://192.168.100.6:8080');
    }
    let str = msg;
    if (typeof str !== "string") str = JSON.stringify(str);
    _loggerWs.send(str);
}

/**
 * 
 * @param {HTMLElement | ChildNode[]} parent
 * @param {string} name
 * @returns {boolean}
 */
const hasElement = (parent, name) => {
    if (Array.isArray(parent)) {
        return parent.findIndex(e => compareStr(e.nodeName, name)) !== -1;
    }
    return Array.from(parent.childNodes).findIndex(e => compareStr(e.nodeName, name)) !== -1;
};

/**
 * @param {string | number | undefined } value
 * @param { number | undefined } fractionDigits
 * @returns {string}
 */
function toFixed(value, fractionDigits) {
    if (typeof value === "undefined") return "";
    if (typeof value === "number") return value.toFixed(fractionDigits);
    return parseFloat(value).toFixed(fractionDigits);
}

/**
 * 
 * @param {number} min 
 * @param {number} max 
 */
function* generate(min, max) {
    let currVal = min;
    while (currVal <= max) yield currVal++;
}

/**
 * 
 * @param {string} a 
 * @param {string} b 
 * @returns {boolean}
 */
const compareStr = (a, b) => (a.toLowerCase() === b.toLowerCase());

/**
 * 
 * @param {HTMLElement | ChildNode[]} parent 
 * @param {string | number | undefined} value 
 * @returns {HTMLElement | undefined}
 */
const firstElement = (parent, value) => {
    let arr = parent;
    if (!Array.isArray(arr)) {
        arr = Array.from(parent.childNodes);
    }
    if (typeof value === "undefined") if (arr.length == 1) return arr[0];
    if (typeof value === "number") {
        if (arr.length && (arr.length - 1) >= value) {
            return arr[value];
        }
    }
    return arr.find(e => compareStr(e.nodeName, value));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function urlToKey(str) {
    try {
        const url = new URL(str);
        let normalized = url.host.toLowerCase() + url.pathname.replace(/\/$/, '');
        const params = new URLSearchParams(url.search);
        params.sort();
        if (params.toString()) {
            normalized += '?' + params.toString();
        }
        let hash = 0;
        for (let i = 0; i < normalized.length; i++) {
            hash = (hash << 5) - hash + normalized.charCodeAt(i);
            hash |= 0;
        }
        return `cache_${Math.abs(hash)}`;
    } catch (e) {
        return `cache__${str.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
}

/**
 * @param {number | undefined} gender
 */
function format_gender(gender) {
    if (gender === 0) return 'Not specified';
    if (gender === 1) return "Famale";
    if (gender === 2) return "Male";
    if (gender === 3) return "Non-binary";
    return "Unknown";
}

/**
 * 
 * @param {string | undefined} date 
 * @param {string | undefined} deathdate
 * @returns {string | undefined}
 */
function format_age(date, deathdate) {
    if (!date) return undefined;

    const birthDate = new Date(date);
    if (isNaN(birthDate.getTime())) {
        throw new Error("Invalid date format");
    }

    const endDate = deathdate ? new Date(deathdate) : new Date();
    if (isNaN(endDate.getTime())) {
        throw new Error("Invalid deathdate format");
    }

    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 0) {
        throw new Error("Death date cannot be before birth date");
    }

    return `${age} year${age === 1 ? '' : 's'} old`;
}

/**
 * @param {string} key 
 */
async function getPropsCache(key) {
    const str = await localforage.getItem(key);
    if (str) return JSON.parse(str);
}

/**
 * 
 * @param {string} key 
 * @param {Object} value 
 */
async function setPropsCache(key, value) {
    let props = (await getPropsCache(key)) ?? {};
    Object.entries(value).forEach(el => {
        props[el[0]] = el[1];
    });
    await localforage.setItem(key, JSON.stringify(props));
    return props;
}

function getYear(str) {
    return new Date(str).getFullYear();
}

function getMonth(str) {
    return new Date(str).getMonth();
}

/**
 * 
 * @param {string | undefined} str 
 * @returns string
 */
function format_date(str) {
    if (!str) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(str));
}

/**
 * 
 * @param {any[]} arr 
 */
function highestRated(arr) {
    const numbers = arr.map(e => e.vote_average);
    const rated = Math.max(...numbers);
    return arr.find(e => e.vote_average === rated);
}

/**
 * 
 * @param {string} pageName 
 * @param {Object | undefined} props 
 */
function navigatePages(pageName, props) {
    let url = `/pages/${pageName}.html`;
    if (props && Object.entries(props).length) {
        let data = Object.entries(props);
        url = `${url}?${data.map(e => (`${e[0]}=${e[1]}`)).join('&')}`;
    }
    window.location.assign(url);
}

/**
 * @param {Object} object
 * @param {string} path 
 */
const get_object = (object, path) => (path.split('/').reduce((acc, key) => acc?.[key], object));

/**
 * 
 * @param {string} str 
 * @returns string
 */
function b64_encode(str) {
    const bytes = new TextEncoder().encode(str);
    const binstr = String.fromCodePoint(...bytes);
    return btoa(binstr);
}

/**
 * 
 * @param {string} b64
 * @returns string
 */
function b64_decode(b64) {
    const binstr = atob(b64.replaceAll(' ', "+"));
    const bytes = Uint8Array.from(binstr, (m) => m.codePointAt(0));
    return new TextDecoder().decode(bytes);
}

const media_title = (media) => (media.name ?? media.title);
const media_type = (media) => (media.name ? 'tv' : 'movie');
const media_key = (media) => (`${media_type(media)}_${media.id}`);

const is_movie = (media) => (!media.name);
const is_tv = (media) => (!media.title);

/**
 * 
 * @param {number} totalMinutes 
 * @returns string
 */
function format_time(totalMinutes) {
    if (!totalMinutes) return '';
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const hDisplay = h > 0 ? `${h}h ` : "";
    const mDisplay = m > 0 ? `${m}mins` : "";
    return (hDisplay + mDisplay).trim();
}

function format_video_time(seconds) {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const paddedSecs = String(secs).padStart(2, '0');
  const paddedMins = String(mins).padStart(2, '0');
  if (hrs > 0) {
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }
  return `${paddedMins}:${paddedSecs}`;
}

/**
 * @typedef {Object} Hook
 * @property {function(HTMLElement): void} [mount] - Called when the element is rendered into the DOM.
 * @property {function(HTMLElement): void} [unmount] - Called when the element is removed from the DOM.
 */

/**
 * Defines a custom element dynamically using a configuration object.
 * @param {string} name - The custom element tag name (must include a hyphen, e.g., 'back-button').
 * @param {Hook} hook - The element configuration object lifecycle hooks.
 */
export default function define(name, hook) {
    const c = class extends HTMLElement {
        connectedCallback() {
            if (hook.mount) {
                hook.mount.call(this, this);
                if (this.mounted) {
                    this.mounted.call(this, this);
                }
            }
        }
        disconnectedCallback() {
            if (hook.unmount) {
                hook.unmount.call(this, this);
            }
        }
    }
    customElements.define(name, c);
}

/**
 * 
 * @param {keyof HTMLElementTagNameMap} tag 
 * @param {ElementCreationOptions | undefined} options
 * @returns 
 */
const newElement = (tag, options) => (document.createElement(tag, options));

const has_page_data = () => {
    return new URL(window.location.href).searchParams.get('data') !== null;
}

/**
 * Get the data string from navigatePages data property method.
 * @returns string | undefined
 */
const get_page_data = () => {
    const uri = new URL(window.location.href);
    const data = uri.searchParams.get('data');
    if (data) {
        return b64_decode(data);
    }
}

/**
 * 
 * @param {number | undefined} amount 
 * @param {string | undefined} currencyCode 
 * @returns 
 */
function format_currency(amount, currencyCode) {
    if (!amount) return '';
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode ?? "USD",
        notation: 'compact',
        maximumFractionDigits: 1,
    });
    return formatter.format(amount);
}

/**
 * 
 * @param {string} selector 
 * @returns 
 */
const element = (selector) => document.querySelector(selector);

export {
    hasElement,
    define,
    firstElement,
    getRandomInt,
    urlToKey,
    toFixed,
    highestRated,
    navigatePages,
    getYear,
    format_date,
    getMonth,
    newElement,
    generate,
    getPropsCache,
    setPropsCache,
    format_time,
    format_currency,
    b64_encode,
    b64_decode,
    format_age,
    format_gender,
    get_page_data,
    has_page_data,
    get_object,
    logger,
    media_key,
    media_title,
    element,
    is_movie,
    is_tv,
    media_type,
    format_video_time
}