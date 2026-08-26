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

function injectData(child, object) {
    Object.entries(object).forEach(o => {
        child[`__${o[0]}`] = o[1];
    });
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
 * 
 * @param {any[]} arr 
 */
function highestRated(arr) {
    const numbers = arr.map(e => e.vote_average);
    return Math.max(...numbers);
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

export {
    hasElement,
    define,
    firstElement,
    getRandomInt,
    urlToKey,
    injectData,
    toFixed,
    highestRated
}