import { base, genre } from '../api/themoviedb.js';
import { movieGenres, tvGenres } from '../constants/genre.js';
import { b64_encode, define, navigatePages, newElement } from '../utils.js';
import { appbarheight } from './appbar.js';
import { top_playlist } from '../constants/top_playlist.js';

define('app-menu', {
    /** @this HTMLElement */
    mount() {
        this.className = `menu-backdrop fixed inset-0 z-1006 hidden bg-black/80 fade w-full`;
        const menuwrapper = newElement('div');
        menuwrapper.className = `mt-[${appbarheight + 4}px] left-0 right-0 mx-4 h-auto px-4 pt-2 pb-4 slide_down bg-white/20 backdrop-blur-md`;
        menuwrapper.innerHTML = `
        <strong-title>Menu</strong-title>
        <div class='h-4'></div>
        <ul class='flex flex-col w-full items-center'></ul>
        `;
        this.appendChild(menuwrapper);
        this.onclick = (e) => {
            unlockscroll();
            this.classList.add('hidden');
        }
        const options = [
            {
                name: "Discover",
                icon: "o",
                onclick: (event) => {
                    event.stopPropagation();
                    navigatePages('discover');
                }
            },
            {
                name: "Top Playlist",
                icon: "list-ol",
                onclick: (event) => {
                    event.stopPropagation();
                    const payload = {
                        title: "Top Playlist",
                        tabs: top_playlist.map(e => ({ data_key: "items", name: e.name, url: base(`list/${e.id}?language=en-US`), id: e.id }))
                    }
                    navigatePages('discover', { data: b64_encode(JSON.stringify(payload)) });
                }
            },
            {
                name: "Movie Genres",
                icon: "film",
                onclick: (event) => {
                    event.stopPropagation();
                    const payload = {
                        title: "Movie Genres",
                        tabs: movieGenres.map(e => ({ name: e.name, url: genre({ type: "movie", id: e.id }), id: e.id })),
                    };
                    navigatePages('discover', { data: b64_encode(JSON.stringify(payload)) });
                }
            },
            {
                name: "TV Genres",
                icon: "tv",
                onclick: (event) => {
                    event.stopPropagation();
                    const payload = {
                        title: "TV Genres",
                        tabs: tvGenres.map(e => ({ name: e.name, url: genre({ type: "tv", id: e.id }), id: e.id })),
                    };
                    navigatePages('discover', { data: b64_encode(JSON.stringify(payload)) });
                }
            },
            {
                name: "My List",
                icon: "list",
                onclick: (event) => {
                    event.stopPropagation();
                    navigatePages('mylist');
                }
            },
            {
                name: "Watch History",
                icon: "history",
                onclick: (event) => {
                    event.stopPropagation();
                    navigatePages('history');
                }
            },
            // {
            //     name: "Sync with TMDb",
            //     icon: "arrow-right-to-bracket",
            //     function: (event) => {
            //         event.stopPropagation();
            //         navigatePages('auth');
            //     }
            // },
        ];

        options.forEach(op => {
            const li = newElement('li');
            li.className = `gap-3 flex items-center mb-2 h-[44px] w-full px-4 bg-white/10`;
            li.innerHTML = `
            <i class='fa-solid fa-${op.icon}'></i>
            <span>${op.name}</span>
            `;
            li.onclick = op.onclick;
            menuwrapper.appendChild(li);
        });
    },
});