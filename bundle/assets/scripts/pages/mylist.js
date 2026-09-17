import { get_my_list } from "../database/mylist.js";
import { newElement } from "../utils.js";
import { append_to_gridview } from '../components/poster.js';

(async () => {
    const scaffold = document.querySelector('app-scaffold');
    const gridview = scaffold.querySelector('app-gridview');
    const tabsview = scaffold.querySelector('.tabs');

    const items = await get_my_list();
    if (!items || !items.length) {
        const noresult = newElement('h2');
        noresult.className = `text-xl opacity-60 mx-auto`;
        noresult.textContent = "Empty list!";
        scaffold.appendChild(noresult);
        return;
    }
    const has_movies = items.findIndex(e => e.title) !== -1;
    const has_tvshows = items.findIndex(e => e.name) !== -1;
    ['Movies', 'TV Shows'].forEach(e => {
        if (!has_movies && e === "Movies") return;
        if (!has_tvshows && e === "TV Shows") return;
        const child = newElement('tab-button');
        child.ariaLabel = e;
        child.onclick = () => {
            child.__select();
            gridview.replaceChildren();
            items.filter(el => (e === "Movies" ? el.title : el.name)).forEach(el => append_to_gridview(gridview, el));
        };
        tabsview.appendChild(child);
    });
    tabsview.firstElementChild.click();
})();