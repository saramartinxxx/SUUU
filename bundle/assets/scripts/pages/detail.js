import { request, get_seasons, detail } from "../api/themoviedb.js";
import { createWrapper } from "../components/wrapper.js";
import { b64_decode, newElement } from "../utils.js";

const uri = new URL(window.location.href);
let data = JSON.parse(b64_decode(uri.searchParams.get('data')));

document.title = `SUUU - ${data.name ?? data.title}`;

(async () => {
    const scaffold = document.querySelector('app-scaffold');
    scaffold.style.paddingTop = '0px';

    const mainview = scaffold.querySelector('main');

    const headerview = newElement('main-header');
    headerview.__data = data;
    headerview.__disable_click = true;
    headerview.mounted = () => {
        const infoview = headerview.querySelector('.header-info');
        infoview.classList.replace('pb-4', 'pb-0');
        const playbtn = newElement('play-button');
        infoview.appendChild(playbtn);
    }
    mainview.appendChild(headerview);

    const overviewinfo = newElement('overview-info');
    overviewinfo.tagline = data.tagline;
    overviewinfo.overview = data.overview;
    mainview.appendChild(overviewinfo);

    data = await request(detail({
        type: data.name ? 'tv' : 'movie',
        id: data.id,
    }));

    if (typeof data?.seasons?.length !== "undefined" && data.seasons?.length > 0) {
        let seasons = await get_seasons({ type: data.name ? "tv" : "movie", id: data.id, min: 1, max: 20 });
        data.seasons = seasons;
        if (seasons && seasons.length >= 19) {
            seasons = await get_seasons({ type: data.name ? "tv" : "movie", id: data.id, min: 21, max: 40 });
            data.seasons = [...data.seasons, ...seasons];
        }
        const seasonsview = newElement('seasons-horizontal');
        seasonsview.__data = data;
        mainview.appendChild(seasonsview);
    }

    const castcrewview = newElement('castcrew-view');
    castcrewview.__data = data;
    mainview.appendChild(castcrewview);

    const informationview = newElement('information-view');
    informationview.__data = data;
    mainview.appendChild(informationview);

    const onMountedWrapper = (wrapper) => {
        wrapper.querySelector('.wrapper-label-row')?.classList.add('pl-4');
        wrapper.querySelector('.wrapper-tabs-row')?.classList.add('pl-4');
        wrapper.querySelector('listview-horizontal')?.classList.add('pl-4');
    }

    if (data.similar && data.similar.results?.length) {
        const similarview = createWrapper("Similar", data.similar.results);
        similarview.mounted = () => {
            similarview.classList.remove('mb-4');
            onMountedWrapper(similarview);
        }
        mainview.appendChild(similarview);
    }

    if (data.recommendations && data.recommendations.results?.length) {
        const recommendationsview = createWrapper("Recommendations", data.recommendations.results);
        recommendationsview.mounted = () => onMountedWrapper(recommendationsview);
        mainview.appendChild(recommendationsview);
    }

})();