import { hasElement, define } from '../utils.js';
import { appbartagname, appbarheight } from "./appbar.js";

const scaffoldtagname = "app-scaffold";

export { scaffoldtagname }

define(scaffoldtagname, {
    /** @this HTMLElement */
    mount() {
        const isAppBar = hasElement(this, appbartagname);

        this.className = `flex flex-col min-h-screen w-screen ${this.className}`;

        if (isAppBar) {
            this.style.paddingTop = `${this.querySelector('scaffold-appbar').dataset.height ?? appbarheight}px`;
        }
    },
});
