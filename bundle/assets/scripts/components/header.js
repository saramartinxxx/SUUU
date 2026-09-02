import { detail, request } from "../api/themoviedb.js";
import { getGenres } from "../constants/genre.js";
import { define, format_date, highestRated, newElement, toFixed } from "../utils.js";
import { posterClick } from './poster.js';

define('main-header', {
    /** @this HTMLElement */
    async mount() {
        this.className = "flex flex-col w-full h-[60vh] relative";
        this.innerHTML = `
        <img class="object-cover w-full h-full fade_long" src="https://images.tmdb.org/t/p/original${this.__data.backdrop_path}" alt="${this.__data.name ?? this.__data.title}">
        <div class="absolute -bottom-px left-0 right-0 h-[40vh] w-full bg-linear-to-b from-transparent to-black"></div>
        <div class="absolute top-0 left-0 right-0 h-[30vh] bg-linear-to-t from-transparent to-black"></div>
        <div class="header-info absolute bottom-0 left-0 right-0 flex flex-col justify-end items-center pb-4 slide_up">
            <img class="title-logo hidden object-contain max-h-[15vh] max-w-[80%]" src="" alt="${this.__data.name ?? this.__data.title}">
            <span class="header-main-info text-center opacity-60 mt-4 mb-1 mx-4 text-s flex items-center">
                <img src="/assets/icons/ic_tmdb.png" class="w-[34px] h-[16px] rounded-[3px] border-[.8px] border-gray-600 mr-[8px]" alt="">${toFixed(this.__data.vote_average, 1)}&nbsp;&nbsp;•&nbsp;&nbsp;${format_date(this.__data.first_air_date ?? this.__data.release_date)}
            </span>
            <span class="genres-info text-center opacity-60 mb-2 mx-4 text-sm">${getGenres(this.__data.genre_ids, this.__data.name ? "tv" : "movie").join('&nbsp;&nbsp;•&nbsp;&nbsp;')}</span>
        </div>
        `;

        /** @type {HTMLImageElement} */
        const titleLogo = this.querySelector('.title-logo');
        const onerr = () => {
            const title = newElement('h1');
            title.className = 'image-fallback text-2xl font-bold w-4/5 text-center';
            title.textContent = (titleLogo.alt || 'Image Unavailable').toUpperCase();
            titleLogo.replaceWith(title);
            titleLogo.classList.remove('hidden');
        };
        const loadtitlelogo = async () => {
            const resp = await request(detail({ type: this.__data.name ? "tv" : "movie", id: this.__data.id }));
            const toprated = highestRated(resp.images.logos);
            if (!toprated) {
                onerr();
                return;
            }
            titleLogo.src = `https://images.tmdb.org/t/p/w500${toprated.file_path}`;
        }
        titleLogo.onerror = (e, s) => {
            if (typeof s === "undefined") {
                loadtitlelogo();
                return;
            }
            onerr();
        }
        await loadtitlelogo();
        titleLogo.classList.remove('hidden');
        if (!this.__disable_click) {
            this.onclick = () => posterClick(this.__data);
        }
    },
    /** @this HTMLElement */
    unmount() { }
});