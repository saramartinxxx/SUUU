import { request, get_seasons, detail } from "../api/themoviedb.js";
import { add_to_list, is_added_to_list, remove_from_list } from '../database/mylist.js';
import { createWrapper } from "../components/wrapper.js";
import { play_media } from "../play.js";
import { element, format_video_time, get_page_data, getPropsCache, is_movie, media_key, media_title, newElement } from "../utils.js";

let media = JSON.parse(get_page_data());
let data;

if (media) data = { ...media };

document.title = `SUUU - ${media_title(media)}`;

(async () => {
    const scaffold = document.querySelector('app-scaffold');
    scaffold.style.paddingTop = '0px';

    const mainview = scaffold.querySelector('main');

    const headerview = newElement('main-header');
    headerview.__data = data;
    headerview.__disable_click = true;
    headerview.mounted = async () => {
        let props = await getPropsCache(media_key(media));
        const infoview = headerview.querySelector('.header-info');
        infoview.classList.replace('pb-4', 'pb-0');
        let btntitle = "Play";
        const playbtn = newElement('play-button');
        if (props?.season && props?.episode) {
            btntitle = `Play S${props.season}E${props.episode}`;
        }
        playbtn.__label = btntitle;
        playbtn.onclick = async (e) => {
            e.stopPropagation();
            if (is_movie(media)) {
                let props = await getPropsCache(media_key(media));
                play_media(media, props?.season, props?.episode);
            } else {
                element('seasons-horizontal').scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
        infoview.appendChild(playbtn);
    }
    mainview.appendChild(headerview);

    const isaddedtolist = await is_added_to_list(media);
    const addtolistbtn = scaffold.querySelector('.add-to-list-btn-icon');
    if (isaddedtolist) {
        addtolistbtn.classList.replace('fa-add', 'fa-check');
    }

    scaffold.querySelector('.add-to-list-btn').onclick = async () => {
        if (await is_added_to_list(media)) {
            const confirmed = confirm(`Remove ${media_title(media)} from list?`);
            if (confirmed) {
                remove_from_list(media);
                addtolistbtn.classList.replace('fa-check', 'fa-add');
            }
        } else {
            add_to_list(media);
            addtolistbtn.classList.replace('fa-add', 'fa-check');
        }
    }

    if (is_movie(media)) {
        const props = (await getPropsCache(media_key(media))) || {};
        if (props?.position && props?.duration) {
            const el = newElement('div');
            el.className = `flex items-center justify-evenly px-4 mt-4`;
            el.innerHTML = `
            <li class='fa-solid fa-play'></li>
            <div class='flex-1 h-[4px] bg-gray-300 mx-4'><div id="movie_progress" class="bg-red-500 h-[4px]" style="width: ${(props.position / props.duration) * 100}%;" ></div></div>
            <span class='text-xs line-clamp-1 whitespace-nowrap'>${format_video_time(props.position)} / ${format_video_time(props.duration)}</span>`;
            mainview.appendChild(el);
        }
    }

    const overviewinfo = newElement('overview-info');
    overviewinfo.tagline = data.tagline;
    overviewinfo.overview = data.overview;
    mainview.appendChild(overviewinfo);

    data = await request(detail({
        type: data.name ? 'tv' : 'movie',
        id: data.id,
    }));

    media.runtime = data.runtime;

    if (typeof data?.seasons?.length !== "undefined" && data.seasons?.length > 0) {
        let seasons = await get_seasons({ type: data.name ? "tv" : "movie", id: data.id, min: 1, max: 20 });
        data.seasons = seasons;
        if (seasons && seasons.length >= 19) {
            seasons = await get_seasons({ type: data.name ? "tv" : "movie", id: data.id, min: 21, max: 40 });
            data.seasons = [...data.seasons, ...seasons];
        }
        const seasonsview = newElement('seasons-horizontal');
        seasonsview.__data = data;
        seasonsview.__media = media;
        mainview.appendChild(seasonsview);
    }

    if (data.videos && data.videos.results && data.videos.results.length) {
        const trailersonly = data.videos.results.filter(e => e.type === "Trailer" || e.type === "Teaser");
        if (trailersonly && trailersonly.length) {
            const trailersview = newElement('trailers-view');
            trailersview.__data = data;
            mainview.appendChild(trailersview);
        }
    }

    const castcrewview = newElement('castcrew-view');
    castcrewview.__data = data;
    mainview.appendChild(castcrewview);

    if (data.belongs_to_collection) {
        const collectionview = newElement('collection-view');
        collectionview.__data = data.belongs_to_collection;
        mainview.appendChild(collectionview);
    }

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