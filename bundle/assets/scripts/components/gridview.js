import { define } from '../utils.js'

define('app-gridview', {
    /** @this HTMLElement */
    mount() {
        this.className = `grid w-full px-4 py-3 gap-3 h-auto pb-4 grid-cols-[repeat(auto-fill,minmax(96px,1fr))]`;
    },
});