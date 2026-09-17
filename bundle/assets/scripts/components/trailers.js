import { define, format_date, newElement } from '../utils.js'

define('trailers-view', {
    /** @this HTMLElement */
    mount() {
        const filter = (e) => ((e.type === "Trailer" || e.type === "Teaser") && e.site === "YouTube");
        const videos = this.__data.videos.results.filter(filter);
        videos.sort((a, b) => {
            if (a.type === "Trailer") return -1;
            if (b.type === "Trailer") return 1;
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });
        if (!videos) return;

        const hasTeaser = videos.find(e => e.type === "Teaser");

        this.className = `flex flex-col gap-3`;
        this.innerHTML = `
        <strong-title-marked class='mx-4'>Trailers${hasTeaser ? " & Teaser" : ""}</strong-title-marked>
        <listview-horizontal></listview-horizontal>
        `;
        const listview = this.querySelector('listview-horizontal');
        videos.forEach((video, index) => {
            const node = newElement('div');
            node.innerHTML = `
            <div class="h-[116px] w-[184px] slide_right overflow-hidden relative border border-white/30">
                <img class="w-full h-full object-cover" src="https://i.ytimg.com/vi_webp/${video.key}/sddefault.webp" alt="">
                <div class="absolute top-0 left-0 inset-0 bg-black/30 flex items-center">
                    <div class="bg-black/70 rounded-full w-[36px] h-[36px] m-auto flex">
                        <i class="fa-solid fa-play m-auto"></i>
                    </div>
                </div>
            </div>
            <div class="flex flex-col px-1 mt-2">
                <span class="text-[14px] opacity-90 mb-1 line-clamp-1">${index + 1}. ${video.name}</span>
                <span class="text-[12px] opacity-70 mb-1 line-clamp-1">${format_date(video.published_at)}</span>
            </div>
            `;
            node.onclick = (e) => {
                e.stopPropagation();
                const iframplayer = newElement('div');
                iframplayer.className = `fixed flex justify-center top-0 left-0 w-screen h-screen bg-cover bg-center z-1008 bg-black/80 fade`;
                iframplayer.innerHTML = `
                <iframe
                    class='aspect-16/9 max-w-[500px] my-auto mx-2 border border-white/30'
                    width="100%"
                    src="https://www.youtube.com/embed/${video.key}"
                    title="${video.name}" 
                    frameborder="0"
                    allow="autoplay"
                    allowfullscreen
                ></iframe>
                `;
                lockscroll();
                iframplayer.onclick = (e) => {
                    e.stopPropagation();
                    unlockscroll();
                    iframplayer.remove();
                }
                document.body.appendChild(iframplayer);
            }
            listview.appendChild(node);
        });
        listview.classList.add('pl-4');
    },
    /** @this HTMLElement */
    unmount() {

    }
});