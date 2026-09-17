import define from "../utils.js";

define('play-button', {
    /** @this HTMLElement */
    mount() {
        this.className = `max-w-[260px] mx-4 w-full h-[44px] mt-2`;
        this.innerHTML = `
        <div class='w-full h-full text-md text-center text-black bg-white gap-2 font-bold flex items-center justify-center'>
            <i class="fa-solid fa-play"></i><span>${this.__label ?? 'Play'}</span>
        </div>`;
    },
    /** @this HTMLElement */
    unmount() {

    }
});