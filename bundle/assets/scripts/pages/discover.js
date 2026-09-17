import { get_object, get_page_data, has_page_data, newElement } from "../utils.js";
import { request, resolve_page } from '../api/themoviedb.js';
import { append_to_gridview } from "../components/poster.js";

/** @typedef {{ name: string, url: string, id?: any, data_key?: string }} DiscoverTab */

/**
 * @typedef {{
 *    title?: string,
 *    tabs?: DiscoverTab[],
 * }} DiscoverInit
 */

/** @type {DiscoverInit} */
let data;

if (has_page_data()) {
    data = JSON.parse(get_page_data());
    if (data.title) {
        document.title = `SUUU - ${data.title}`;
        document.body.querySelector('div.discover-appbar-wrapper > strong-title').textContent = data.title;
    }
}

let current;
let url;
let page = 1;
let stillloadingmore = false;
let datakey = 'results';
let dataended = false;

(async () => {
    const scaffold = document.querySelector('app-scaffold');
    const gridview = scaffold.querySelector('app-gridview');
    const tabsview = scaffold.querySelector('.tabs');

    /** 
     * @param {DiscoverTab} tab
     * @param {any} self
     */
    const selectTab = async (self, tab) => {
        gridview.replaceChildren();
        current = tab;
        url = tab.url;
        if (tab.data_key) datakey = tab.data_key;
        page = 1;
        dataended = false;
        self.__select();
        const resp = await request(tab.url);
        page = page + 1;
        get_object(resp, datakey).forEach(el => append_to_gridview(gridview, el));
        const resp1 = await request(resolve_page(url, page));
        get_object(resp1, datakey).forEach(el => append_to_gridview(gridview, el));
    }

    data.tabs.forEach(tab => {
        const child = newElement('tab-button');
        child.ariaLabel = tab.name;
        child.onclick = () => selectTab(child, tab);
        tabsview.appendChild(child);
    });

    tabsview.firstElementChild.click();

    window.addEventListener('scroll', async () => {
        if (stillloadingmore || dataended) return;

        const maxExtent = document.body.scrollHeight;
        const scrollOffset = Math.ceil(window.innerHeight + window.scrollY);

        if (scrollOffset >= maxExtent) {
            stillloadingmore = true;
            const loadingbar = scaffold.querySelector('.bottom-loading');
            loadingbar.classList.replace('hidden', 'flex');
            page = page + 1;
            const resp = await request(resolve_page(url, page));
            loadingbar.classList.replace('flex', 'hidden');
            stillloadingmore = false;
            const arr = get_object(resp, datakey);
            if (arr && arr.length) arr.forEach(el => append_to_gridview(gridview, el));
            if (Object.hasOwn(resp, 'total_pages') && resp.total_pages === page) {
                dataended = true;
            } else if (!arr || !arr?.length) {
                dataended = true;
            }
        }
    });
})();