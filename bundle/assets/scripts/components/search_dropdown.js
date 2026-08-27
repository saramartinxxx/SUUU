import { base, request } from "../api/themoviedb.js";
import define from "../utils.js";
import { apptextfieldheight } from "./textfield.js";

define('search-dropdown', {
    /** @this HTMLElement */
    mount() {
        this.className = `w-full h-[${apptextfieldheight}px] search-dropdown relative`;
        this.innerHTML = `
        <glass-search></glass-search>
        <ul class="search-dropdown-results absolute top-full left-0 right-0 mt-1 mx-0 mb-0 p-0 list-none bg-white/10 backdrop-blur-md border border-white/10 rounded-lg max-h-[40vh] overflow-y-auto shadow-md hidden z-50 slide_down"></ul>
        `;
        document.addEventListener('click', (e) => {
            document.querySelector('.search-dropdown-results').classList.add('hidden');
        });
        const input = this.querySelector('.glass-input');
        let timeout;
        input.addEventListener('input', (e) => {
            if (timeout) clearTimeout(timeout);
            timeout = undefined;
            timeout = setTimeout(async () => {
                const resp = await request(base(``));
            }, 1000);
        });
    },
    /** @this HTMLElement */
    unmount() {}
});