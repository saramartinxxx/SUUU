import define from "../utils.js";

define('circle-progressbar', {
    /** @this HTMLElement */
    mount() {
        this.className = `${this.className} w-[${this.dataset.width ?? '46'}px] loader${this.dataset.size ? `_${this.dataset.size}` : ''}`;
    },
});