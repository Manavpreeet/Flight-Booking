// lib/cache.ts
import { get, set } from "idb-keyval";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>
): Promise<T> {
    const cached = await get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    const data = await fetcher();
    await set(key, { data, timestamp: Date.now() });

    return data;
}
