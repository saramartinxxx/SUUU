import { base, request } from "../api/themoviedb.js";
import define from "../utils.js";
import { createWrapper } from "./wrapper.js";

define('collection-view', {
    /** @this HTMLElement */
    async mount() {
        const data = await request(base(`collection/${this.__data.id}`));
        if (data && data.parts && data.parts.length) {
            const wrapper = createWrapper('Collection', data.parts, undefined, 'backdrop');
            wrapper.mounted = () => {
                wrapper.querySelector('.wrapper-label-row')?.classList.add('pl-4');
                wrapper.querySelector('.wrapper-tabs-row')?.classList.add('pl-4');
                wrapper.querySelector('listview-horizontal')?.classList.add('pl-4');
            }
            this.appendChild(wrapper);
        }
    },
});