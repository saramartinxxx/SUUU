import { define, injectData } from '../utils.js';

define('data-wrapper', {
    /** @this HTMLElement */
    mount() {
        this.className = "mb-4";
        this.innerHTML = `
        <div class="wrapper-label-row flex items-center gap-1 mb-2.5">
            <div class="flex items-center"><div class="w-1 h-4 bg-red-500 mr-2 rounded-sm"></div> <h2 class="text-xl md:text-2xl font-bold">${this.__label}</h2></div>
            ${this.__hint ? `<div class="flex items-center"><span class="text-[11px] opacity-70 mt-2 ml-2">${this.__hint}</span></div>` : ""}
        </div>
        `;
        if (this.__tabs && this.__tabs.length) {
            const tabs = document.createElement('div');
            tabs.className = "wrapper-tabs-row flex gap-3 mb-3.5 overflow-x-auto pr-4";
            this.__tabs.forEach(el => tabs.appendChild(el));
            this.appendChild(tabs);
        }
        if (this.__items && this.__items.length) {
            const listview = document.createElement('listview-horizontal');
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