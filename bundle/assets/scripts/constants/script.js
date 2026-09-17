export const iframescript = () => {
    let uri = new URL(window.location.href);
    const post = (msg) => {
        let info = {
            url: uri.toString(),
            position: msg.currentTime || msg.player_progress || msg.progress?.watched,
            duration: msg.duration || msg.player_duration || msg.progress?.duration,
        };
        playlink_js.postMessage(JSON.stringify(info));
    }
    window.addEventListener('message', (event) => {
        post(event.data?.data || event.data);
    });
}

export class ProviderScript {
    static get manual() {
        return '(async()=>{let e;await new Promise(t=>{e=setInterval(()=>{const e=document.querySelector("video");e&&!isNaN(e.duration)&&t()},1e3)}),clearInterval(e);const t=new URL(window.location.href),r=t.searchParams.get("startAt"),n=document.querySelector("video");r&&(n.currentTime=parseInt(r)),n.addEventListener("timeupdate",()=>{playlink_js.postMessage(JSON.stringify({url:t.toString(),position:n.currentTime,duration:n.duration}))})})();';
    }

    static get auto() {
        return `(${iframescript.toString()})();`;
    }
}