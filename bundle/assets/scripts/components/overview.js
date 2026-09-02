import define from "../utils.js";

define('overview-info', {
    /** @this HTMLElement */
    mount() {
        this.className = `p-4 slide_up w-full flex flex-col`;
        this.innerHTML = `${this.tagline ? `<span class="opacity-70 text-center mx-auto mb-2">${this.tagline}</span>` : ""}<p onclick="this.classList.toggle('line-clamp-3');this.classList.toggle('text-center');" class="opacity-70 text-center line-clamp-3 whitespace-pre-line">${this.overview}</p>`;
    },
    /** @this HTMLElement */
    unmount() {

    }
});