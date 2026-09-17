import { createWrapper, createWrapperChildren } from "../components/wrapper.js";
import { DefaultDataSroll } from "../constants/data.js";
import { get_history } from "../database/history.js";
import { sekey } from "../play.js";
import { getPropsCache, getRandomInt, media_key, media_title, media_type, newElement } from "../utils.js";

const createHistoryView = async () => {
    const history = ((await get_history()) || []);
    if (history && history.length) {
        const wrapper = createWrapper('Continue Watching', history.slice(0, 30), undefined, "backdrop");
        wrapper.mounted = async () => {
            wrapper.querySelector('.wrapper-label-row')?.classList.add('pl-4');
            wrapper.querySelector('.wrapper-tabs-row')?.classList.add('pl-4');
            wrapper.querySelector('listview-horizontal')?.classList.add('pl-4');
            for (const his of history.slice(0, 30)) {
                const key = media_key(his);
                const type = media_type(his);
                const props = await getPropsCache(key);
                if (props) {
                    const poster = wrapper.querySelector(`#${key}_poster`);
                    const progress = poster.querySelector(`#${key}_progress`);
                    const title = poster.querySelector(`#${key}_title`);
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
                            title.textContent = `S${props.season}E${props.episode} - ${media_title(his)}`;
                        }
                    }
                    if (pos && dur) {
                        progress.style.width = `${(pos / dur) * 100}%`;
                        progress.parentElement.style.opacity = '100%';
                    }
                }
            }
        }
        return wrapper;
    }
}

(async () => {
    const scaffold = document.querySelector('app-scaffold');
    scaffold.style.paddingTop = '0px';
    const main = scaffold.querySelector('main');
    let count = 0;
    for (let el of DefaultDataSroll) {
        const data = await (el.promise ? el.promise : el.tabs[0].promise)();
        const wrapper = createWrapper(el.label, data.results);
        if (el.hint) {
            wrapper.__hint = el.hint;
        }
        if (count === 0) {
            const item = data.results[getRandomInt(0, data.results.length - 1)];
            const header = newElement('main-header');
            header.__data = item;
            main.appendChild(header);
            const historyview = await createHistoryView();
            if (historyview) main.appendChild(historyview);
        }
        if (el.tabs && el.tabs.length) {
            wrapper.__tabs = el.tabs.map((t, i) => {
                const tab = newElement('tab-button');
                tab.ariaLabel = t.label;
                tab.onclick = async (e) => {
                    tab.__select();
                    const __data = await t.promise();
                    wrapper.clearItems();
                    wrapper.setItems(createWrapperChildren(__data.results));
                }
                if (i == 0) tab.dataset.default = 'true';
                return tab;
            });
        }
        wrapper.mounted = () => {
            wrapper.querySelector('.wrapper-label-row')?.classList.add('pl-4');
            wrapper.querySelector('.wrapper-tabs-row')?.classList.add('pl-4');
            wrapper.querySelector('listview-horizontal')?.classList.add('pl-4');
        }
        main.appendChild(wrapper);
        count++;
    }
    const tmdblicense = newElement('tmdb-license');
    scaffold.appendChild(tmdblicense);
    const applegal = newElement('app-legal');
    scaffold.appendChild(applegal);
})();