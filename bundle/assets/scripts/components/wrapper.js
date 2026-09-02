import { define, newElement } from '../utils.js';

define('data-wrapper', {
    /** @this HTMLElement */
    mount() {
        this.className = "mb-4";
        this.innerHTML = `
        <div class="wrapper-label-row flex items-center gap-1 mb-2.5">
            <strong-title-marked>${this.__label}</strong-title-marked>
            ${this.__hint ? `<div class="flex items-center"><span class="text-[11px] opacity-70 mt-2 ml-2">${this.__hint}</span></div>` : ""}
        </div>
        `;
        if (this.__tabs && this.__tabs.length) {
            const tabs = newElement('div');
            tabs.className = "wrapper-tabs-row flex gap-3 mb-3.5 overflow-x-auto pr-4";
            this.__tabs.forEach(el => tabs.appendChild(el));
            this.appendChild(tabs);
        }
        if (this.__items && this.__items.length) {
            const listview = newElement('listview-horizontal');
            this.__items.forEach(el => listview.appendChild(el));
            this.appendChild(listview);
        }
        this.setItems = (items) => {
            const listview = this.querySelector('listview-horizontal');
            items.forEach(node => listview.appendChild(node));
        }
        this.clearItems = () => {
            const listview = this.querySelector('listview-horizontal');
            Array.from(listview.childNodes).forEach(node => listview.removeChild(node));
        }
    },
});

const createWrapperChildren = (items) => {
    return items.map(object => {
        const poster = newElement('app-poster');
        poster.__data = object;
        return poster;
    });
}

const createWrapper = (label, items) => {
    const wrapper = newElement('data-wrapper');
    wrapper.__label = label;
    wrapper.__items = createWrapperChildren(items);
    return wrapper;
}

export { createWrapperChildren, createWrapper }