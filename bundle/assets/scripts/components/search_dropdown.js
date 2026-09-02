import { base, request } from "../api/themoviedb.js";
import { getGenres } from "../constants/genre.js";
import define, { newElement, toFixed, format_date } from "../utils.js";
import { posterClick } from "./poster.js";
import { apptextfieldheight } from "./textfield.js";
import { appbarheight } from './appbar.js';

define('search-item', {
    /** @this HTMLElement */
    mount() {
        this.className = `flex items-center justify-start my-2 w-full`;
        this.innerHTML = `
                <div class="w-[76px] h-[112px] rounded-lg overflow-hidden relative shrink-0">
                    <img class="object-cover w-full h-full transition" src="https://images.tmdb.org/t/p/w400/${this.__data.poster_path}" alt="${this.__data.name ?? this.__data.title}">
                </div>
                <div class="flex flex-col items-start justify-center mx-3">
                    <strong class="line-clamp-1">${this.__data.name ?? this.__data.title}</strong>
                    <span class="text-sm text-gray-300 line-clamp-1">${toFixed(this.__data.vote_average, 1)}&nbsp;&nbsp;|&nbsp;&nbsp;${format_date(this.__data.first_air_date ?? this.__data.release_date)}</span>
                    <span class="text-sm text-gray-300 line-clamp-1">${getGenres(this.__data.genre_ids, this.__data.name ? "tv" : "movie").join('  •  ')}</span>
                </div>
                `;
        this.onclick = () => posterClick(this.__data);
    },
    /** @this HTMLElement */
    unmount() {

    }
});

define('search-dropdown', {
    /** @this HTMLElement */
    mount() {
        this.className = `w-full h-[${apptextfieldheight}px] search-dropdown relative`;
        this.innerHTML = `<glass-search></glass-search>`;

        const backdrop = newElement('div');
        backdrop.className = `dropdown-backdrop fixed inset-0 z-1000 hidden bg-black/50 fade w-full`;
        const dropdown = newElement('ul');
        dropdown.className = `search-dropdown-results absolute w-auto top-[${appbarheight}px] left-[16px] right-[16px] mt-1 mx-0 mb-0 px-3 py-1 list-none bg-white/20 backdrop-blur-md border border-white/30 rounded-lg max-h-[50vh] overflow-y-auto shadow-md shadow-white/30 hidden z-1001 slide_down`;
        backdrop.appendChild(dropdown);
        document.body.appendChild(backdrop);

        const glassInput = this.querySelector('.glass-input');
        const glassSearch = this.querySelector('glass-search');

        glassSearch.onclick = async (e) => {
            e.stopPropagation();
            if (glassInput.value && !dropdown.childNodes.length) {
                const resp = await request(base(`search/multi?query=${encodeURIComponent(glassInput.value)}`));
                setResults(resp.results);
            }
        };

        backdrop.onclick = (e) => {
            document.body.style.overflow = '';
            backdrop.classList.add('hidden');
            glassInput.blur();
            dropdown.classList.add('hidden');
        }

        /** @param {any[]} results */
        const setResults = (results) => {
            Array.from(dropdown.childNodes).forEach(child => dropdown.removeChild(child));
            results.forEach(item => {
                const li = newElement('search-item');
                li.__data = item;
                dropdown.appendChild(li);
                document.body.style.overflow = "hidden";
                backdrop.classList.remove('hidden');
                dropdown.classList.remove('hidden');
            });
        }

        let timeout;
        const input = this.querySelector('.glass-input');
        input.addEventListener("focus", (e) => {
            if (dropdown.childNodes.length) {
                document.body.style.overflow = "hidden";
                backdrop.classList.remove('hidden');
                dropdown.classList.remove('hidden');
            }
        });
        input.addEventListener('input', (e) => {
            if (timeout) clearTimeout(timeout);
            timeout = undefined;
            timeout = setTimeout(async () => {
                if (!e.target.value) {
                    document.body.style.overflow = "";
                    backdrop.classList.add('hidden');
                    dropdown.classList.add('hidden');
                    setResults([]);
                    return;
                }
                const resp = await request(base(`search/multi?query=${encodeURIComponent(e.target.value)}`));
                setResults(resp.results);
            }, 500);
        });
    },
});