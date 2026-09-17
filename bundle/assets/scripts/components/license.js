import {define} from "../utils.js"

define('tmdb-license', {
    /** @this HTMLElement */
    mount() {
        this.className = 'w-auto p-4 border border-gray-800 bg-gray-800 mx-3 mt-3 opacity-80';
        this.innerHTML = `<strong><i class="fa-solid fa-certificate mr-2"></i>TMDb License</strong><br><span class="text-gray-300">This app uses the <a href="https://developer.themoviedb.org/docs/getting-started" class="text-blue-400">TheMovieDb API</a> but is not endorsed or certified by TheMovieDb.</span>`;
    },
    /** @this HTMLElement */
    unmount() {
        
    }
});