/**@typedef {(event: IDBVersionChangeEvent, db: IDBDatabase | undefined) => {}} DBUpgradeEventHandler */
/**@typedef {{ table: string, name?: string, version?: number, onupgrade?: DBUpgradeEventHandler }} DBProps */

/**@param {IDBRequest} request */
export const DBRequestAsync = (request) => {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export class DefaultDatabase {
    /**@type {string} */
    dbname;

    /**@type {number} */
    dbversion;

    /**@type {string} */
    tablename;

    /**@type {IDBDatabase} */
    db;

    /**@param {DBProps} props  */
    constructor(props) {
        const { table, name, version, onupgrade } = props;
        if (!table) throw Error('missing table name!');
        this.dbname = name || "suuu.db";
        this.dbversion = version || 1;
        this.tablename = table;

        const request = indexedDB.open(this.dbname, this.dbversion);
        request.onupgradeneeded = (event) => {
            const rawDb = event.target.result;
            event.target.transaction.onerror = (e) => console.error("Upgrade error:", e.target.error);
            event.target.transaction.onabort = (e) => console.error("Upgrade aborted:", event.target.transaction.error);
            if (onupgrade) onupgrade(event, rawDb);
        };
        request.onsuccess = (e) => {
            this.db = e.target.result;
        };
        request.onerror = (e) => console.error("DB Open Error:", e.target.error);
    }

    waitfordb() {
        return new Promise(resolve => {
            if (this.db) {
                resolve();
                return;
            }
            let interval;
            interval = setInterval(() => { if (this.db) { resolve(); clearInterval(interval) } }, 100);
        });
    }

    /**@param {IDBTransactionMode | undefined} mode  */
    transaction(mode) { return this.db.transaction(this.tablename, mode || 'readwrite') }

    /**@param {IDBTransactionMode | undefined} mode  */
    store(mode) { return this.transaction(mode).objectStore(this.tablename) }
}