import { define } from '../utils.js';

define('listview-horizontal', {
    /** @this HTMLElement */
    mount() {
        this.className = 'flex flex-none items-start overflow-x-auto gap-3 no-scrollbar pb-4 pr-4';
    },
    /** @this HTMLElement */
    unmount() {
        
    }
});