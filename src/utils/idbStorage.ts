const DB_NAME = 'winxp-fs';
const DB_VERSION = 1;
const STORE_NAME = 'overlay';
const KEY = 'state';

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => { req.result.createObjectStore(STORE_NAME); };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function loadOverlay<T>(fallback: T): Promise<T> {
    try {
        const db = await openDB();
        return await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(KEY);
            req.onsuccess = () => resolve(req.result ?? fallback);
            req.onerror = () => reject(req.error);
        });
    } catch {
        return fallback;
    }
}

export async function saveOverlay<T>(value: T): Promise<void> {
    try {
        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put(value, KEY);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch {
        // IndexedDB in not available, ignore the error
    }
}