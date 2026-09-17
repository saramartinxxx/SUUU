import define from "../utils.js";

define('strong-title', {
    /** @this HTMLElement */
    mount() {
        this.className = `text-xl md:text-2xl font-bold ${this.className}`;
    },
    /** @this HTMLElement */
    unmount() {
        
    }
});

define('strong-title-marked', {
    /** @this HTMLElement */
    mount() {
        this.className = `flex items-center ${this.className}`;
        this.innerHTML = `<div class="w-1 h-4 bg-red-500 mr-2"></div><strong-title>${this.textContent}</strong-title>`;
    },
    /** @this HTMLElement */
    unmount() {
        
    }
});