import define, { b64_encode, navigatePages, newElement } from "../utils.js";

export function peopleClick(data) {
    const b64 = b64_encode(JSON.stringify(data));
    navigatePages('people', { data: b64 });
}

define('people-view', {
    /** @this HTMLElement */
    mount() {
        this.className = `flex-none flex flex-col justify-center slide_right`;
        this.innerHTML = `
        <div class="h-[96px] w-[96px] rounded-full border border-white/30 overflow-hidden relative mx-auto">
            <img class="w-full h-full object-cover" src="https://images.tmdb.org/t/p/w400${this.__data.profile_path}" alt="${this.__data.name}">
        </div>
        <div class="w-[96px] text-center mt-2">
            <span class="text-xs text-white/90 text-center line-clamp-3" onclick="this.classList.toggle('line-clamp-3')">${this.__data.name}${this.__data.character ? `<br><span class="text-white/70">as </span>${this.__data.character}` : ""}</span>
        </div>`;
        this.onclick = () => peopleClick(this.__data);
    },
    /** @this HTMLElement */
    unmount() {

    }
});

define('castcrew-view', {
    /** @this HTMLElement */
    mount() {
        this.className = `flex flex-col gap-3`;
        this.innerHTML = `
        <strong-title-marked class='mx-4'>Cast & Crew</strong-title-marked>
        <listview-horizontal></listview-horizontal>
        `;

        const listview = this.querySelector('listview-horizontal');
        const people = [...this.__data.credits.cast, ...this.__data.credits.crew];
        people.forEach(p => {
            const node = newElement('people-view');
            node.__data = p;
            listview.appendChild(node);
        });
        listview.classList.add('pl-4');
    },
    /** @this HTMLElement */
    unmount() {

    }
});