import { movieGenres, tvGenres } from "../constants/genre.js";
import { element, generate, newElement } from "../utils.js";
import { channels } from "../constants/channel.js";
import { countries } from "../constants/country.js";
import { base, request } from '../api/themoviedb.js';
import { append_to_gridview } from '../components/poster.js';

let stillloadingmore = false;
let dataended = false;

const defaultfilters = {
    with_genres: -1,
    primary_release_year: -1,
    with_origin_country: '',
    'vote_average.gte': -1,
};

let filters = {
    type: 'movie',
    ...defaultfilters,
    page: 1,
};

/**
* @param {'movie' | 'tv' | undefined} type 
* @param {number | undefined} page 
*/
const filter = async (type, page) => {
    filters.type = type || filters.type;
    filters.page = page || filters.page;
    element('.filter-menu').setAttribute('data-open', false);
    element('#filter-button').setAttribute('data-active', false);
    let url = base(`discover/${filters.type}?page=${filters.page}`);
    for (const key in filters) {
        if (key === "page" || key === "type") continue;
        if (key === "with_genres") {
            if (!(filters.type === "movie" ? movieGenres : tvGenres).find(e => e.id === filters[key])) {
                filters[key] = defaultfilters[key];
                const genrebtn = element('#genre > div > span');
                if (genrebtn) genrebtn.textContent = "None";
                continue;
            }
        }
        if (filters[key] === -1 || filters[key] === "") continue;
        url = url + `&${key}=${filters[key].toString()}`;
    }
    const data = await request(url);
    data.results.forEach(el => append_to_gridview(element('app-gridview'), el));
    hideCenterLoading();
    return data;
}

const toggleMenu = (active) => {
    const menu = element('.filter-menu');
    const isOpen = menu.getAttribute('data-open') === 'true';
    menu.setAttribute('data-open', active || !isOpen);
    element('#filter-button').setAttribute('data-active', active || !isOpen);
}

const createfilterbutton = (name, value, onclick) => {
    const btn = newElement('button');
    btn.id = name.toLowerCase();
    btn.className = `py-3 px-4 border border-white/30 w-full flex items-center justify-between`;
    btn.innerHTML = `
    <strong>${name}</strong>
    <div class='flex w-auto items-center gap-2 justify-end'>
       <span class='opacity-80 line-clamp-1 w-[80%]'>${value}</span>
       <li class='fa-solid fa-angle-down'></li>
    </div>
    `;
    btn.onclick = onclick;
    return btn;
}

/**@typedef {(item: any, index: number) => ({ id: any, name: string, selected: boolean, onclick: (self: HTMLElement, id: any, name: string) => void })} ItemBuilder */

/**
 * @param {ItemBuilder} builder
 * @param {any[]} items
 */
const itemsbuilder = (items, builder) => {
    return items.map((item, index) => {
        const { id, name, selected, onclick } = builder(item, index);
        const el = newElement('button');
        el.className = `flex items-center justify-center gap-3 py-2`;
        el.innerHTML = `
            <li class='fa-solid fa-check opacity-0 data-[selected=true]:opacity-100 text-blue-500'></li>
            <strong class='mx-2'>${name}</strong>
            <li class='fa-solid fa-check opacity-0'></li>
            `;
        el.querySelector('li').setAttribute('data-selected', `${selected}`);
        el.onclick = () => onclick(el, id, name);
        return el;
    });
}

/**
 * @param {ItemBuilder} builder
 * @param {any[]} items
 */
const builddialogitems = (items, builder) => {
    const dialogwrapper = element('.filter-dialog');
    const dialog = element('.filter-dialog-items');
    dialog.replaceChildren();
    const children = itemsbuilder(items, (item, index) => {
        const { id, name, selected, onclick } = builder(item, index);
        return {
            id,
            name,
            selected,
            onclick: (self, id, name) => {
                Array.from(dialog.children).forEach(e => e.setAttribute('data-selected', 'false'));
                self.setAttribute('data-selected', 'true');
                dialogwrapper.classList.replace('flex', 'hidden');
                onclick(self, id, name);
            }
        }
    });
    children.forEach(child => dialog.appendChild(child));
    dialogwrapper.classList.replace('hidden', 'flex');
}

const buildMenu = () => {
    const menu = element('.filter-menu-items');
    menu.replaceChildren();

    const genre = createfilterbutton('Genre', "None", (e) => {
        e.stopPropagation();
        const items = [{ id: -1, name: "None" }, ...(filters.type === 'movie' ? movieGenres : tvGenres)];
        builddialogitems(items, (item, index) => {
            return {
                id: item.id,
                name: item.name,
                selected: item.id === filters.with_genres,
                onclick: (self, id, name) => {
                    filters.with_genres = id;
                    element('#genre > div > span').textContent = name;
                }
            }
        });
    });
    menu.appendChild(genre);

    const year = createfilterbutton('Year', "None", (e) => {
        e.stopPropagation();
        const years = [...generate(1890, new Date().getFullYear())].reverse().map(e => ({ id: e, name: e.toString() }));
        builddialogitems([{ id: -1, name: "None" }, ...years], (item, index) => {
            return {
                id: item.id,
                name: item.name,
                selected: item.id === filters.primary_release_year,
                onclick: (self, id, name) => {
                    filters.primary_release_year = id;
                    element('#year > div > span').textContent = name;
                }
            }
        });
    });
    menu.appendChild(year);

    const country = createfilterbutton('Country', "None", (e) => {
        e.stopPropagation();
        builddialogitems([{ id: '', name: "None" }, ...countries.sort((a, b) => a.name.localeCompare(b.name))], (item, index) => {
            return {
                id: item.id,
                name: item.name,
                selected: item.id === filters.with_origin_country,
                onclick: (self, id, name) => {
                    filters.with_origin_country = id;
                    element('#country > div > span').textContent = name;
                }
            }
        });
    });
    menu.appendChild(country);

    const rate = createfilterbutton('Rate', "None", (e) => {
        e.stopPropagation();
        const rates = [...generate(1, 9)].reverse().map(e => ({ id: e, name: `${e}.0` }));
        builddialogitems([{ id: -1, name: "None" }, ...rates], (item, index) => {
            return {
                id: item.id,
                name: item.name,
                selected: item.id === filters['vote_average.gte'],
                onclick: (self, id, name) => {
                    filters['vote_average.gte'] = id;
                    element('#rate > div > span').textContent = name;
                }
            }
        });
    });
    menu.appendChild(rate);
}

const showCenterLoading = () => element('.center-loading').classList.replace('hidden', 'flex');

const hideCenterLoading = () => element('.center-loading').classList.replace('flex', 'hidden');

(async () => {
    const scaffold = element('app-scaffold');
    const gridview = scaffold.querySelector('app-gridview');
    const tabsview = scaffold.querySelector('.tabs');
    ['movie', 'tv'].forEach(e => {
        const child = newElement('tab-button');
        child.ariaLabel = e === "movie" ? "Movie" : "TV Shows";
        child.onclick = () => {
            child.__select();
            gridview.replaceChildren();
            showCenterLoading();
            filter(e, 1);
        };
        tabsview.appendChild(child);
    });
    const spacer = newElement('div');
    spacer.className = `flex`;
    spacer.style.flex = '1';
    tabsview.appendChild(spacer);
    const filterbtn = newElement('button');
    filterbtn.id = 'filter-button';
    filterbtn.className = `data-[active=true]:bg-red-500 transition-all duration-300 py-1 px-2`;
    filterbtn.innerHTML = `<li class='fa-solid fa-filter text-lg'></li>`
    filterbtn.setAttribute('data-active', 'false');
    filterbtn.onclick = (e) => {
        e.stopPropagation();
        window.scrollTo(0, 0);
        toggleMenu();
    }
    tabsview.appendChild(filterbtn);
    tabsview.firstElementChild.click();
    buildMenu();
    element('.reset-filter-btn').onclick = () => {
        element('app-gridview').replaceChildren();
        filters = { type: filters.type, ...defaultfilters, page: 1 };
        buildMenu();
        showCenterLoading();
        filter();
    };
    element('.start-filter-btn').onclick = () => {
        element('app-gridview').replaceChildren();
        showCenterLoading();
        filter(filters.type, 1);
    };

    window.addEventListener('scroll', async () => {
        if (stillloadingmore || dataended) return;

        const maxExtent = document.body.scrollHeight;
        const scrollOffset = Math.ceil(window.innerHeight + window.scrollY);

        if (scrollOffset >= maxExtent) {
            stillloadingmore = true;
            const loadingbar = scaffold.querySelector('.bottom-loading');
            loadingbar.classList.replace('hidden', 'flex');
            let resp = await filter(undefined, filters.page + 1);
            loadingbar.classList.replace('flex', 'hidden');
            stillloadingmore = false;
            if (Object.hasOwn(resp, 'total_pages') && resp.total_pages === page) {
                dataended = true;
            } else if (!resp.results || !resp.results?.length) {
                dataended = true;
            }
        }
    });
})();