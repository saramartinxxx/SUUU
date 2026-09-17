window['lockscroll'] = function lockScroll() {
    document.body.style.overflow = "hidden";
};

window['unlockscroll'] = function () {
    document.body.style.overflow = "";
}

window['lockedscroll'] = () => (document.body.style.overflow === "hidden");