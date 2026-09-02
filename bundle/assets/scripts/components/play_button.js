import define from "../utils.js";

define('play-button', {
    /** @this HTMLElement */
    mount() {
        this.className = `h-[40px] max-w-[250px] w-full text-md mt-2 text-center text-black bg-white gap-2 font-bold rounded-3xl flex items-center justify-center`;
        this.innerHTML = `<i class="fa-solid fa-play"></i><span>Play</span>`;
    },
    /** @this HTMLElement */
    unmount() {
        
    }
});