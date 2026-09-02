import { define } from '../utils.js';

const appbartagname = "scaffold-appbar";
const appbarheight = 56;

export { appbartagname, appbarheight }

define(appbartagname, {
    /** @this HTMLElement */
    mount() {
        this._scrollListener = function () {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 0) return;
            this.classList.add('transition-all', 'duration-300', 'ease-in-out');
            if (currentScrollY > this._lastScrollY && currentScrollY > appbarheight) {
                this.classList.add('-translate-y-full');
            } else {
                this.classList.remove('-translate-y-full');
            }
            if (!this.dataset.nobg) {
                if (currentScrollY >= appbarheight) {
                    this.classList.add('bg-black');
                } else {
                    this.classList.remove('bg-black');
                }
            }
            this._lastScrollY = currentScrollY;
        }
        this._lastScrollY = 0;
        this._boundScrollListener = this._scrollListener.bind(this);
        this.className = `${this.className} z-3000 flex items-center fixed top-0 left-0 right-0 h-[${appbarheight}px]`;
        window.addEventListener('scroll', this._boundScrollListener, { passive: true });
    },
    /** @this HTMLElement */
    unmount() {
        window.removeEventListener('scroll', this._boundScrollListener);
    },
});

define('appbar-title', {
    /** @this HTMLElement */
    mount() {
        this.className = `${this.className.length ? this.className : "px-2"} font-semibold line-clamp-1`;
    },
});

define('appbar-action', {
    /** @this HTMLElement */
    mount() {
        this.className = `flex items-center justify-end px-4 grow`;
    },
});

define('back-button', {
    /** @this HTMLElement */
    mount() {
        this.className = `px-4 py-2`;
        this.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
        this.onclick = () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/index.html';
            }
        }
    },
});

define('back-button-circle', {
    /** @this HTMLElement */
    mount() {
        this.className = `bg-white/10 backdrop-blur-md rounded-full w-[40px] h-[40px] flex items-center justify-center shadow-md shadow-white/30`;
        this.innerHTML = `<back-button></back-button>`;
    },
    /** @this HTMLElement */
    unmount() {

    }
});