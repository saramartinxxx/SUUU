import { get_history } from "../database/history.js";
import { sekey } from "../play.js";
import { format_video_time, getPropsCache, media_key, media_title, media_type, newElement } from "../utils.js";
import { posterClick } from '../components/poster.js';

(async () => {
    const scaffold = document.querySelector('app-scaffold');

    const items = await get_history();
    if (!items || !items.length) {
        const noresult = newElement('h2');
        noresult.className = `text-xl opacity-60 mx-auto`;
        noresult.textContent = "Empty history!";
        scaffold.appendChild(noresult);
        return;
    }

    const listview = newElement('div');
    listview.className = `overflow-y-auto w-full px-4 gap-3 flex flex-col h-auto pb-4`;

    items.slice(0, 60).forEach(his => {
        const el = newElement('div');
        el.className = `flex items-center gap-3`;
        const poster = newElement('app-poster');
        poster.__data = his;
        poster.__view = 'backdrop';
        poster.dataset.notitle = true;
        poster.mounted = () => {
            poster.classList.replace('w-42', 'w-32');
            poster.classList.replace('lg:w-46', 'lg:w-36');
            poster.onclick = () => { };
        }
        el.appendChild(poster);
        const info = newElement('info');
        info.className = `flex flex-col gap-3 slide_right w-full`;
        info.innerHTML = `
        <strong class='text-base line-clamp-1'>${media_title(his)}</strong>
        <div id="progress-wrapper" class='items-center w-full'>
            <div class='w-full h-[4px] bg-gray-300'><div id="progress" class="bg-red-500 h-[4px]" style="width: 0%;" ></div></div>
            <div class='flex items-center justify-between mt-2'>
                <li class='fa-solid fa-play text-xs'></li>
                <span class='text-xs line-clamp-1 whitespace-nowrap'>00:00 / 00:00</span>
            </div>
        </div>
        `;
        el.appendChild(info);
        const key = media_key(his);
        getPropsCache(key).then(props => {
            const type = media_type(his);
            if (props) {
                const wrapper = info.querySelector(`#progress-wrapper`);
                const time = info.querySelector(`span`);
                let pos, dur;
                if (type === "movie" && props.position && props.duration) {
                    pos = props.position;
                    dur = props.duration;
                } else if (type === "tv") {
                    if (props.season && props.episode) {
                        const childkey = sekey(props.season, props.episode);
                        if (childkey in props && props[childkey].position && props[childkey].duration) {
                            pos = props[childkey].position;
                            dur = props[childkey].duration;
                        }
                        info.querySelector('strong').textContent = `S${props.season}E${props.episode} - ${media_title(his)}`;
                    }
                }
                if (pos && dur) {
                    time.textContent = `${format_video_time(pos)} / ${format_video_time(dur)}`;
                    wrapper.querySelector('#progress').style.width = `${(pos / dur) * 100}%`;
                }
            }
        });
        el.onclick = () => posterClick(his);
        listview.appendChild(el);
    });

    scaffold.appendChild(listview);

})();