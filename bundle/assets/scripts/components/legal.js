import {define } from '../utils.js';

define('app-legal', {
    /** @this HTMLElement */
    mount() {
        this.className = 'w-auto p-4 border border-gray-800 bg-gray-800 m-3 opacity-80 mb-4';
        this.innerHTML = `<strong><i class="fa-solid fa-book mr-2"></i>LEGAL</strong><br><span class="text-gray-300">This application does not host, store, or distribute any media content. All streams are provided by independent third-party services. <br><br>Please direct all copyright infringement or takedown requests to the responsible third-party hosts.</span>`;
    },
    /** @this HTMLElement */
    unmount() {
        
    }
});