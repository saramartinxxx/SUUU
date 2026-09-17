import { define, newElement } from '../utils.js';

const apptextfieldtagname = "app-textfield";
const apptextfieldhint = "Search";
const apptextfieldheight = 44;

export { apptextfieldheight, apptextfieldhint, apptextfieldtagname }

define(apptextfieldtagname, {
    /** @this HTMLElement */
    mount() {
        let className = `w-full h-[${apptextfieldheight}px] px-3 bg-white/20`;
        this.className = `flex items-center ${this.className.length ? this.className : className}`;
        const input = newElement('input');
        input.id = apptextfieldtagname;
        input.placeholder = apptextfieldhint;
        input.className = `w-full h-[${apptextfieldheight}px] border-0 border-transparent focus:outline-hidden focus:ring-0`;
        this.appendChild(input);
    },
});

define('textfield-prefix', {
    /** @this HTMLElement */
    mount() {
        if (this.parentNode.nodeName.toLowerCase() !== apptextfieldtagname) {
            this.style.display = "none";
            return;
        }
        this.className = `pr-4`;
    },
});