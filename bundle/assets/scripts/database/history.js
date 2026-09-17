import { media_key } from "../utils.js";
import { DBRequestAsync, DefaultDatabase } from "./base.js";

const TABLE = 'history';
const VERSION = 1;
const KEYNAME = '__key__';
const INDEX_NAME = '__by_updated_at__';
const UPDATE_AT_NAME = '__updated_at__';

/**
 * @param {IDBVersionChangeEvent} event
 * @param {IDBDatabase | undefined} db 
 * 
 */
const onupgrade = (event, db) => {
    let historyStore;
    if (db && !db.objectStoreNames.contains(TABLE)) {
        historyStore = db.createObjectStore(TABLE, { keyPath: KEYNAME });
    } else {
        historyStore = event.target.transaction.objectStore(TABLE);
    }

    if (!historyStore.indexNames.contains(INDEX_NAME)) {
        historyStore.createIndex(INDEX_NAME, UPDATE_AT_NAME, { unique: false });
    }
}

const historydb = new DefaultDatabase({ table: TABLE, version: VERSION, onupgrade, name: 'history.db' });

/**@returns {Promise<any[]>} */
export const get_history = async () => {
    await historydb.waitfordb();
    return new Promise(resolve => {
        const request = historydb.store('readonly').index(INDEX_NAME).openCursor(null, 'prev');
        const results = [];
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        request.onerror = () => resolve([]);
    });
}

/**@returns {Promise<boolean>} */
export const is_added_to_history = async (media) => {
    await historydb.waitfordb();
    const result = await DBRequestAsync(historydb.store('readonly').getKey(media_key(media)));
    return result !== undefined;
}

export const add_to_history = async (media) => {
    media[KEYNAME] = media_key(media);
    media[UPDATE_AT_NAME] = Date.now();
    await DBRequestAsync(historydb.store('readwrite').put(media));
}

export const remove_from_history = async (media) => {
    await historydb.waitfordb();
    await DBRequestAsync(historydb.store('readwrite').delete(media_key(media)));
}