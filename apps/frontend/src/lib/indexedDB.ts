// lib/indexedDB.ts
import { openDB } from "idb";

const DB_NAME = "flightDB";
const STORE_NAME = "searchResults";

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "query" });
            }
        },
    });
}

export async function saveSearchResult(query: string, data: any) {
    const db = await initDB();
    await db.put(STORE_NAME, { query, data, timestamp: Date.now() });
}

export async function getCachedSearchResult(query: string) {
    const db = await initDB();
    const result = await db.get(STORE_NAME, query);
    return result;
}
