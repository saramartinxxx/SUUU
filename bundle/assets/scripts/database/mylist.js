import { media_key } from "../utils.js";
import { DBRequestAsync, DefaultDatabase } from "./base.js";

const TABLE = 'mylist';
const VERSION = 1;
const KEYNAME = '__key__';

/**@param {IDBDatabase} db */
const onupgrade = (_, db) => {
    if (db && !db.objectStoreNames.contains(TABLE)) {
        db.createObjectStore(TABLE, { keyPath: KEYNAME });
    }
}

const listdb = new DefaultDatabase({ table: TABLE, version: VERSION, onupgrade, name: 'mylist.db' });

/**@returns {Promise<any[]>} */
export const get_my_list = async () => {
    await listdb.waitfordb();
    const result = await DBRequestAsync(listdb.store('readonly').getAll());
    return result;
}

/**@returns {Promise<boolean>} */
export const is_added_to_list = async (media) => {
    await listdb.waitfordb();
    const result = await DBRequestAsync(listdb.store('readonly').getKey(media_key(media)));
    return result !== undefined;
}

export const add_to_list = async (media) => {
    await listdb.waitfordb();
    media[KEYNAME] = media_key(media);
    await DBRequestAsync(listdb.store('readwrite').put(media));
}

export const remove_from_list = async (media) => {
    await listdb.waitfordb();
    await DBRequestAsync(listdb.store('readwrite').delete(media_key(media)));
}

/**
 * @param {'movie' | 'tv'} type
 * @returns {Promise<any[]>}
 */
export const get_my_list_by_type = async (type) => {
    await listdb.waitfordb();
    const range = IDBKeyRange.bound(type, type + '\uffff');
    const result = await DBRequestAsync(listdb.store('readonly').getAll(range));
    return result;
}