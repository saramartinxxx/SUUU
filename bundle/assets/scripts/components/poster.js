import { b64_encode, define, media_key, media_title, navigatePages, newElement, toFixed } from '../utils.js';

export function posterClick(data) {
    const b64 = b64_encode(JSON.stringify(data));
    navigatePages('detail', { data: b64 });
}

define('app-poster', {
    /** @this HTMLElement */
    mount() {
        /**@type {'poster' | 'backdrop'} */
        const viewmode = this.__view || 'poster';
        const isposter = viewmode === "poster";

        this.id = `${media_key(this.__data)}_poster`;
        this.className = `flex-none ${isposter ? 'w-28 lg:w-32' : 'w-42 lg:w-46'} fade_in slide_right`;
        this.innerHTML = `
        <div class="flex-none w-full fade_in slide_right">
            <div class="relative ${isposter ? 'aspect-[2/3.2]' : 'aspect-[3.2/2]'} overflow-hidden group border-white/30 border"><img alt="${media_title(this.__data)}"
                    class="w-full h-full object-cover hover:cursor-pointer hover:scale-105 transition border-0"
                    src="https://images.tmdb.org/t/p/w400${isposter ? this.__data?.poster_path : this.__data?.backdrop_path}">
                <div
                    class="absolute text-white top-1 right-1 bg-black/50 backdrop-blur-md px-1.5 py-0.2 text-[10px] lg:text-[12px] font-bold border border-white/30">
                    ${this.__data?.vote_average <= 0 ? '...' : toFixed(this.__data?.vote_average, 1)}</div>
            </div>
            <div class="w-full bg-gray-300 h-[4px]" style="opacity: 0%;" ><div id="${media_key(this.__data)}_progress" class="bg-red-500 h-[4px]" style="width: 0%;" ></div></div>
            ${this.dataset.notitle ? '' : `
                <div class="flex w-full items-center justify-start mt-1">
                    <span id="${media_key(this.__data)}_title" class="text-[12px] md:text-sm lg:text-base text-start truncate px-1 opacity-80">${media_title(this.__data)}</span>
                </div>
                `}
        </div>`;
        this.onclick = () => posterClick(this.__data);
    },
});

export const append_to_gridview = (gridview, data) => {
    const media_id = media_key(data);
    if (gridview.querySelector(`[data-media_id="${media_id}"]`)) return;
    const itemview = newElement('app-poster');
    itemview.__data = data;
    itemview.dataset.media_id = media_id;
    itemview.mounted = () => {
        itemview.classList.add('mx-auto');
        itemview.classList.replace('w-28', 'w-full');
        itemview.classList.replace('lg:w-32', 'w-full');
    }
    gridview.appendChild(itemview);
}