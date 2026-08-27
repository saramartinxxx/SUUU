import { data_scroll } from "../constants/data.js";
import { getRandomInt, highestRated, injectData } from "../utils.js";

const createWrapperChildren = (results) => {
    return results.map(object => {
        const poster = document.createElement('app-poster');
        injectData(poster, object);
        poster.onclick = () => {
            const type = object.name ? "tv" : "movie";
            window.location.href = `pages/detail.html?type=${type}&id=${object.id}`;
        }
        return poster;
    });
}

const createWrapper = (label, results) => {
    const wrapper = document.createElement('data-wrapper');
    wrapper.__label = label;
    wrapper.__items = createWrapperChildren(results);
    return wrapper;
}

(async () => {
    const scaffold = document.querySelector('app-scaffold');
    scaffold.style.paddingTop = '0px';
    const main = document.querySelector('main');
    let count = 0;
    for (let el of data_scroll) {
        const data = await (el.promise ? el.promise : el.tabs[0].promise)();
        const wrapper = createWrapper(el.label, data.results);
        if (el.hint) {
            wrapper.__hint = el.hint;
        }
        if (count === 0) {
            const item = data.results[getRandomInt(0, data.results.length - 1)];
            const header = document.createElement('main-header');
            injectData(header, item);
            main.appendChild(header);
        }
        if (el.tabs && el.tabs.length) {
            wrapper.__tabs = el.tabs.map((t, i) => {
                const tab = document.createElement('tab-button');
                tab.textContent = t.label;
                tab.addEventListener("click", async () => {
                    tab.parentElement.querySelectorAll('tab-button').forEach(tt => {
                        tt.removeAttribute('selected');
                    });
                    tab.setAttribute('selected', 'true');
                    const __data = await t.promise();
                    wrapper.clearItems();
                    wrapper.setItems(createWrapperChildren(__data.results));
                });
                if (i == 0) tab.setAttribute('selected', 'true');
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
    const tmdblicense = document.createElement('tmdb-license');
    scaffold.appendChild(tmdblicense);
    const applegal = document.createElement('app-legal');
    scaffold.appendChild(applegal);
})();