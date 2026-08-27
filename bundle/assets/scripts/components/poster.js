import { define, toFixed } from '../utils.js';

define('app-poster', {
    /** @this HTMLElement */
    mount() {
        this.className = "flex-none w-28 lg:w-32 fade_in slide_right";
        this.innerHTML = `
        <div class="flex-none w-28 lg:w-32 fade_in slide_right">
            <div class="relative aspect-[2/3.2] rounded-lg overflow-hidden group border-zinc-500/60 border"><img alt="${this.__name ?? this.__title}"
                    class="w-full h-full object-cover hover:cursor-pointer hover:scale-105 transition border-0"
                    src="https://images.tmdb.org/t/p/w400${this.__poster_path}">
                <div
                    class="absolute text-white top-1 right-1 bg-black/50 backdrop-blur-md px-1.5 py-0.2 rounded-md text-[10px] lg:text-[12px] font-bold border border-white/20">
                    ${toFixed(this.__vote_average, 1)}</div>
            </div>
            <div class="flex w-full items-center justify-center mt-1"><span
                    class="text-[12px] md:text-sm lg:text-base text-center truncate px-2 opacity-80">${this.__name ?? this.__title}</span></div>
        </div>`;
    },
    /** @this HTMLElement */
    unmount() {

    }
});