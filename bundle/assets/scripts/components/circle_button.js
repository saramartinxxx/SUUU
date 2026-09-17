import define from "../utils.js";

define('circle-button', {
    /** @this HTMLElement */
    mount() {
        this.className = `${this.className} bg-white/10 backdrop-blur-md rounded-full w-[40px] h-[40px] flex items-center justify-center shadow-md shadow-white/30`;
    },
    /** @this HTMLElement */
    unmount() {
        
    }
});