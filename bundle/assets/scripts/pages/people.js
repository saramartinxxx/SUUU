import { b64_decode, format_date, newElement } from "../utils.js";
import { request, base } from '../api/themoviedb.js'
import { getGenres } from '../constants/genre.js'
import { posterClick } from '../components/poster.js'

const uri = new URL(window.location.href);
let data = JSON.parse(b64_decode(uri.searchParams.get('data')));

document.title = `SUUU - ${data.name}`;

(async () => {
    const scaffold = document.querySelector('app-scaffold');
    const mainview = scaffold.querySelector('main');

    const headerview = newElement('div');
    headerview.className = `flex flex-col items-center gap-3 slide_up`;
    headerview.innerHTML = `
    <div class="relative h-[144px] w-[144px] overflow-hidden rounded-full border border-white/30">
        <img class='object-cover w-full h-full' src="https://images.tmdb.org/t/p/w400${data.profile_path}" alt="${data.name}">
    </div>
    <strong-title>${data.name}</strong-title>
    `;
    mainview.appendChild(headerview);

    const __data = await request(base(`person/${data.id}?append_to_response=combined_credits`));
    data = { ...data, ...__data };

    const biography = newElement('overview-info');
    biography.overview = data.biography;
    mainview.appendChild(biography);

    const infoview = newElement('people-infoview');
    infoview.__data = data;
    infoview.mounted = () => {
        infoview.classList.add('mt-2');
    }
    mainview.appendChild(infoview);

    const actingwrapper = newElement('div');
    actingwrapper.className = `flex flex-col px-4`;
    actingwrapper.innerHTML = `
    <strong-title-marked>Acting</strong-title-marked>
    `;
    const actingtypeview = newElement('div');
    actingtypeview.className = `flex items-center gap-3 mt-2`;
    const types = ['movie', 'tv'];
    types.forEach((t, i) => {
        const node = newElement('tab-button');
        node.textContent = t == "tv" ? "TV shows" : "Movies";
        if (i === 0) node.setAttribute('selected', 'true');
        node.onclick = () => {
            actingtypeview.querySelectorAll('tab-button').forEach(tab => {
                tab.removeAttribute('selected');
            });
            node.setAttribute('selected', 'true');
            setActingItems(data.combined_credits.cast, t);
        }
        actingtypeview.appendChild(node);
    });
    actingwrapper.appendChild(actingtypeview);

    const actingitemsview = newElement('ul');
    actingitemsview.className = `flex flex-col overflow-y-auto w-full h-auto pt-3 gap-3`;
    actingwrapper.appendChild(actingitemsview);

    /**@param {any[]} items */
    const setActingItems = (items, type) => {
        Array.from(actingitemsview.childNodes).forEach(child => {
            actingitemsview.removeChild(child);
        });
        let arr = items.filter(e => (type === "tv" ? e.name : e.title));
        arr.sort((a, b) => new Date(b.first_air_date ?? b.release_date) - new Date(a.first_air_date ?? a.release_date));
        arr.forEach(item => {
            const node = newElement('li');
            node.onclick = () => posterClick(item);
            node.className = `flex items-center`;
            const poster = newElement('app-poster');
            poster.__data = item;
            poster.setAttribute('data-notitle', 'true');
            poster.mounted = () => {
                poster.onclick = () => { };
            }
            node.appendChild(poster);
            const nodeinfo = newElement('div');
            nodeinfo.className = `flex flex-col pl-4 slide_right gap-2 w-auto overflow-hidden`;
            nodeinfo.innerHTML = `
            <strong class='line-clamp-2'>${item.name ?? item.title}</strong>
            <div class='flex '><span class='opacity-70 mr-2 text-sm text-nowrap'>as</span><span class='text-sm'>${item.character}</span></div>
            <span class='text-xs opacity-80'>${format_date(item.first_air_date ?? item.release_date)}</span>
            <span class='text-xs opacity-80 text-ellipsis line-clamp-2'>${getGenres(item.genre_ids).join('&nbsp;&nbsp;•&nbsp;&nbsp;')}</span>
            `;
            node.appendChild(nodeinfo);
            actingitemsview.appendChild(node);
        });
    }

    setActingItems(data.combined_credits.cast, 'movie');
    mainview.appendChild(actingwrapper);
})();