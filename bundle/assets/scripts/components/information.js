import define, { format_age, format_currency, format_date, format_gender, format_time, newElement } from "../utils.js";

define('information-view', {
    /** @this HTMLElement */
    mount() {
        const language = new Intl.DisplayNames(["en"], { type: "language", style: "long" });
        const infomap = {
            "Status": this.__data.status,
            "Runtime": format_time(this.__data.runtime),
            "Budget": format_currency(this.__data.budget),
            "Revenue": format_currency(this.__data.revenue),
            "Released": format_date(this.__data.first_air_date ?? this.__data.release_date),
            "Original Title": this.__data.original_title,
            "Original Language": language.of(this.__data.original_language ?? ""),
            "Spoken Languages": this.__data.spoken_languages?.map(e => e.english_name).join("&nbsp;&nbsp;•&nbsp;&nbsp;"),
            "Product Countries": this.__data.production_countries?.map(e => e.name).join("&nbsp;&nbsp;•&nbsp;&nbsp;"),
            "TMDb": `<a href="https://www.themoviedb.org/${this.__data.name ? 'tv' : 'movie'}/${this.__data.id}" class='text-blue-400'>www.themoviedb.org/${this.__data.name ? 'tv' : 'movie'}/${this.__data.id}</a>`,
        }
        if (this.__data.homepage) {
            infomap['Page'] = `<a href="${this.__data.homepage}" class='text-blue-400'>${new URL(this.__data.homepage).host}</a>`;
        }
        this.className = `flex flex-col gap-3 pb-4`;
        this.innerHTML = `
        <strong-title-marked class='mx-4'>Information</strong-title-marked>
        <ul class="info-wrapper rounded-lg bg-gray-800 w-auto flex flex-col flex-none justify-start p-3 mx-4 overflow-hidden"></ul>
        `;
        const infowrapper = this.querySelector('.info-wrapper');
        Object.entries(infomap).forEach(entry => {
            if (!entry[1]) return;
            const node = newElement('li');
            node.className = `flex items-start my-2 overflow-hidden text-ellipsis`;
            node.innerHTML = `
            <span class="opacity-60 w-[8.125rem] line-clamp-1 text-sm">${entry[0]}</span>
            <span class="text-sm opacity-90 w-[calc(100%-8.2rem)] line-clamp-3 text-ellipsis" onclick="this.classList.toggle('line-clamp-3')">${entry[1]}</span>
            `;
            infowrapper.appendChild(node);
        });
    },
    /** @this HTMLElement */
    unmount() {

    }
});

define('people-infoview', {
    /** @this HTMLElement */
    mount() {
        const infomap = {
            "Known for": this.__data.known_for_department,
            "Age": format_age(this.__data.birthday, this.__data.deathday),
            "Gender": format_gender(this.__data.gender),
            "Original Name": this.__data.original_name,
            "Birthday": format_date(this.__data.birthday),
            "Place of Birth": this.__data.place_of_birth,
            "Death Day": format_date(this.__data.deathday),
            "TMDb": `<a href="https://www.themoviedb.org/person/${this.__data.id}" class='text-blue-400'>www.themoviedb.org/person/${this.__data.id}</a>`,
            "IMDb": this.__data.imdb_id ? `<a href="https://www.imdb.com/name/${this.__data.imdb_id}" class='text-blue-400'>www.imdb.com/name/${this.__data.imdb_id}</a>` : undefined,
            "Page": this.__data.homepage ? `<a href="${this.__data.homepage}" class='text-blue-400'>${new URL(this.__data.homepage).host}</a>` : undefined,
        }
        Object.entries(infomap).forEach(entry => {
            if (!entry[1]) {
                delete infomap[entry[0]];
            }
            if (entry[1] === "Unknown") {
                delete infomap[entry[0]];
            }
        });
        this.className = `flex flex-col gap-3 pb-4 slide_up`;
        this.innerHTML = `
        <strong-title-marked class='mx-4'>Information</strong-title-marked>
        <ul class="info-wrapper rounded-lg bg-gray-800 w-auto flex flex-col flex-none justify-start p-3 mx-4 overflow-hidden"></ul>
        `;
        const infowrapper = this.querySelector('.info-wrapper');
        Object.entries(infomap).forEach(entry => {
            if (!entry[1]) return;
            const node = newElement('li');
            node.className = `flex items-start my-2 overflow-hidden text-ellipsis`;
            node.innerHTML = `
            <span class="opacity-60 w-[8.125rem] line-clamp-1 text-sm">${entry[0]}</span>
            <span class="text-sm opacity-90 w-[calc(100%-8.2rem)] line-clamp-3 text-ellipsis" onclick="this.classList.toggle('line-clamp-3')">${entry[1]}</span>
            `;
            infowrapper.appendChild(node);
        });
    },
    /** @this HTMLElement */
    unmount() {

    }
});