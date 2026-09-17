import { play_media, sekey } from "../play.js";
import define, { format_time, getPropsCache, newElement, format_date, media_key, element } from "../utils.js";

define('seasons-horizontal', {
    /** @this HTMLElement */
    async mount() {
        const key = media_key(this.__data);
        this.className = `flex flex-col gap-3`;
        let props = (await getPropsCache(key)) || {};
        let currentSeason = props?.season ?? 1;
        this.innerHTML = `
        <button style="anchor-name: --seasons-selection-button" class="seasons-selection-button mx-4 h-[40px] px-3 flex items-center justify-center bg-gray-800 w-fit slide_up"><strong>Season ${currentSeason}</strong> <i class="fa-solid fa-sort ml-1 text-white/70"></i></button>
        <div class="dropdown-backdrop fixed inset-0 z-1000 hidden bg-black/80 fade"></div>
        <ul class="seasons-selection-dropdown py-3 px-1 shadow-sm shadow-white/30 fade max-h-[50vh] py-3 overflow-y-auto border border-white/30 bg-white/20 backdrop-blur-md z-1001"></ul>
        <listview-horizontal></listview-horizontal>
        `;
        const button = this.querySelector('.seasons-selection-button');
        const dropdown = this.querySelector('.seasons-selection-dropdown');
        const listview = this.querySelector('listview-horizontal');
        const backdrop = this.querySelector('.dropdown-backdrop');

        button.onclick = (e) => {
            e.stopPropagation();
            const isShowing = dropdown.classList.toggle('show');
            if (isShowing) {
                backdrop.classList.remove('hidden');
            } else {
                backdrop.classList.add('hidden');
            }
        };

        backdrop.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.remove('show');
            backdrop.classList.add('hidden');
        };

        /** @param {any[]} episodes */
        const buildEpisodes = (episodes) => {
            Array.from(listview.childNodes).forEach(child => listview.removeChild(child));
            episodes.forEach((episode, index) => {
                const node = newElement('div');
                const key = sekey(episode.season_number, episode.episode_number);
                const hasPos = key in props && 'position' in props[key] && 'duration' in props[key];
                node.className = `flex-none w-[164px] pb-2 ${key}`;
                node.innerHTML = `
                <div class="h-[96px] w-[164px] slide_right overflow-hidden relative border border-white/30">
                    <img class="w-full h-full object-cover" src="https://images.tmdb.org/t/p/w500${episode.still_path}" alt="">
                    <div class="absolute top-0 left-0 inset-0 bg-black/30 flex items-center">
                        <div class="bg-black/70 rounded-full w-[36px] h-[36px] m-auto flex">
                            <i class="fa-solid fa-play m-auto"></i>
                        </div>
                    </div>
                    <span class="absolute bottom-0 right-0 text-[12px] px-[6px] py-px bg-black/80 text-white/90 border border-white/30 m-0">${format_time(episode.runtime)}</span>
                </div>
                <div id="${key}" class="w-full bg-gray-300 h-[4px]" style="opacity: ${hasPos ? 100 : 0}%;" ><div id="progress_${key}" class="bg-red-500 h-[4px]" style="width: ${(props[key]?.position / props[key]?.duration) * 100}%;" ></div></div>
                <div class="flex flex-col px-1 mt-2">
                    <span class="text-[14px] opacity-90 mb-1 line-clamp-1">${index + 1}. ${episode.name}</span>
                    <span class="text-[12px] opacity-70 mb-1 line-clamp-1">${format_date(episode.air_date)}</span>
                    <span class="text-[12px] opacity-80 line-clamp-2" onclick="this.classList.toggle('line-clamp-2')">${episode.overview}</span>
                </div>
                `;
                if (props?.season == episode.season_number && props?.episode == episode.episode_number) {
                    node.className = node.className + ' bg-gray-800';
                }
                node.onclick = (e) => {
                    e.stopPropagation();
                    element('play-button').querySelector('span').textContent = `Play S${episode.season_number}E${episode.episode_number}`;
                    play_media(this.__media, episode.season_number, episode.episode_number);
                    Array.from(listview.children).forEach((child) => {
                        child.classList.remove('bg-gray-800');
                    });
                    node.classList.add('bg-gray-800');
                    node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                }
                listview.appendChild(node);
            });
            listview.classList.add('pl-4');
            setTimeout(() => {
                if (props?.season && props?.episode) {
                    for (const child of listview.children) {
                        if (child.classList.contains(sekey(props?.season, props?.episode))) {
                            const targetLeft = child.offsetLeft - listview.offsetLeft;
                            listview.scrollTo({
                                left: targetLeft - 16,
                                behavior: "smooth"
                            });
                            break;
                        }
                    }
                }
            }, 200);
        }

        this.__data.seasons.forEach((item, i) => {
            const selected = item.season_number === currentSeason;
            const li = newElement('li');
            li.className = `flex items-center mb-1 justify-start px-6 py-1`;
            li.innerHTML = `
            <div class="w-[58px] h-[94px] relative overflow-hidden border border-white/30">
                <img class="w-full h-full object-cover" src="https://images.tmdb.org/t/p/w300${item.poster_path}" alt="">
            </div>
            <div class="ml-2 flex flex-col">
                <strong>${i + 1}. ${item.name}</strong>
                <span class="text-sm text-gray-300">${format_date(item.air_date)}&nbsp;&nbsp;|&nbsp;&nbsp;${item.episodes?.length} episodes</span>
            </div>
            `;
            if (selected) li.classList.add('bg-red-500');
            li.onclick = () => {
                Array.from(dropdown.children).forEach(el => el.classList.remove('bg-red-500'));
                dropdown.classList.remove('show');
                backdrop.classList.add('hidden');
                li.classList.add('bg-red-500');
                button.querySelector('strong').innerText = `Season ${item.season_number}`;
                buildEpisodes(item.episodes);
            }
            dropdown.appendChild(li);
        });

        const index = this.__data.seasons.findIndex(e => e.season_number === currentSeason);
        buildEpisodes(this.__data.seasons[index].episodes);
    },
});