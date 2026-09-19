import { define } from '../utils.js';
import { apptextfieldheight } from './textfield.js';

define('glass-search', {
    /** @this HTMLElement */
    mount() {
        this.className = `relative w-full mx-auto h-[${apptextfieldheight - 4}px] ${this.className}`;
        this.innerHTML = `
        <div class="relative flex items-center bg-transparent backdrop-blur-md pl-4 py-2 h-full shadow-lg transition-all duration-300 focus-within:bg-white/20 border border-white/10">
            <i class="text-white/50 fa-solid fa-search text-lg"></i>
            <input id="glass-input" type="text" placeholder="Search anything" class="glass-input w-full h-full bg-transparent pl-3 text-white placeholder-white/50 border-none outline-none focus:ring-0 text-md" />
            <button class="w-[44px] h-[44px] p-2 mx-2 flex items-center"><i class="fa-solid fa-bars text-white/90 text-lg"></i></button>
        </div>`;
        this.querySelector('button').onclick = (e) => {
            e.stopPropagation();
            if (lockedscroll()) {
                unlockscroll();
            } else {
                lockscroll();
            }
            document.querySelector('app-menu').classList.toggle('hidden');
        }
    },
});