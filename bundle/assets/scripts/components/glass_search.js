import { define } from '../utils.js';
import { apptextfieldheight } from './textfield.js';

define('glass-search', {
    /** @this HTMLElement */
    mount() {
        this.className = `relative w-full mx-auto h-[${apptextfieldheight - 4}px] ${this.className}`;
        this.innerHTML = `
        <div class="relative flex items-center border border-white/30 bg-black/10 backdrop-blur-md rounded-lg pl-4 py-2 h-full shadow-lg transition-all duration-300 focus-within:border-white/40 focus-within:bg-white/15">
            <i class="text-white/50 fa-solid fa-search text-lg"></i>
            <input id="glass-input" type="text" placeholder="Type to search your favorite" class="glass-input w-full h-full bg-transparent pl-3 text-white placeholder-white/50 border-none outline-none focus:ring-0 text-md" />
            <button class="w-[44px] h-[44px] p-2 mx-2 flex items-center"><i class="fa-solid fa-bars text-white/90 text-lg"></i></button>
        </div>`;
        this.querySelector('button').onclick = (e) => {
            e.stopPropagation();
        }
    },
});