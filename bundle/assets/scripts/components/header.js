import { base, request } from "../api/themoviedb.js";
import { getGenres } from "../constants/genre.js";
import { define, getRandomInt, highestRated, injectData } from "../utils.js";

/**
 * 
 * @param {HTMLElement} self 
 */
const initialize = async (self) => {
    self.innerHTML = `
    <img class="object-cover w-full h-full fade_long" src="https://images.tmdb.org/t/p/original${self.__backdrop_path}" alt="${self.__name ?? self.__title}">
    <div class="absolute -bottom-px left-0 right-0 h-[40vh] w-full bg-linear-to-b from-transparent to-black"></div>
    <div class="absolute top-0 left-0 right-0 h-[30vh] bg-linear-to-t from-transparent to-black"></div>
    <div class="absolute bottom-0 left-0 right-0 h-[30vh] flex flex-col justify-end items-center pb-4">
        <img class="title-logo hidden object-contain max-h-[15vh] max-w-[80%] slide_up" src="" alt="${self.__name ?? self.__title}">
        <div class="flex items-center justify-center mt-4 mb-2">
            <span class="text-center opacity-60">${getGenres(self.__genre_ids, self.__name ? "tv" : "movie").join('  •  ')}</span> 
        </div>
    </div>
    `;

    /** @type {HTMLImageElement} */
    const titleLogo = self.querySelector('.title-logo');
    titleLogo.onerror = (event, source) => {
        if (!source) return;
        const title = document.createElement('h1');
        title.className = 'image-fallback text-2xl font-bold w-4/5 text-center';
        title.textContent = (titleLogo.alt || 'Image Unavailable').toUpperCase();
        titleLogo.replaceWith(title);
    };
    const loadtitlelogo = async () => {
        const resp = await request(base(`${self.__name ? "tv" : "movie"}/${self.__id}/images?language=en-US`));
        const toprated = highestRated(resp.logos);
        titleLogo.src = `https://images.tmdb.org/t/p/w500${toprated.file_path}`;
    }
    await loadtitlelogo();
    titleLogo.classList.remove('hidden');
    self.onclick = () => {
        window.location.href = `/pages/detail.html?type=${self.__name ? "tv" : "movie"}&id=${self.__id}`;
    }
}

define('main-header', {
    /** @this HTMLElement */
    async mount() {
        this.className = "flex flex-col w-full h-[60vh] relative";
        await initialize(this);
    },
    /** @this HTMLElement */
    unmount() { }
});