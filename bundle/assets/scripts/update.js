import { request } from "./api/themoviedb.js";

globalThis.__home__ = globalThis.__home__ || 'https://suuu.app';
globalThis.__id__ = globalThis.__id__ || 'com.saramartin.suuu';

(async () => {
    const metadata = await request(`${__home__}/manifest.json`, { urlbuilder: url => (url), });
    const liveversion = parseInt(metadata.version.replaceAll('.', ''));
    const extension = await playlink_js.extension.get(__id__);
    const version = parseInt(extension.version.replaceAll('.', ''));
    if (version < liveversion) {
        alert('A new version of SUUU is available to update! Go to Extension -> SUUU -> Details -> Update.');
    }
})().catch(err => { console.error(err) });