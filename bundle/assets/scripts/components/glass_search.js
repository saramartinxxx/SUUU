import { define } from '../utils.js';
import { apptextfieldheight } from './textfield.js';

define('glass-search', {
    /** @this HTMLElement */
    mount() {
        this.className = `relative w-full mx-auto h-[${apptextfieldheight - 4}px]`;
        this.innerHTML = `
        <div class="relative flex items-center border border-white/10 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 h-full shadow-lg transition-all duration-300 focus-within:border-white/40 focus-within:bg-white/15">
            <i class="text-white/60 fa-solid fa-search"></i>
            <input id="glass-input" type="text" placeholder="Search" class="glass-input w-full h-full bg-transparent pl-3 text-white placeholder-white/50 border-none outline-none focus:ring-0 text-md" />
        </div>`;
    },
    /** @this HTMLElement */
    unmount() {

    }
});