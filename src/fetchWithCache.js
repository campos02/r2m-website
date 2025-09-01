const cache = new Map;

export async function fetchWithCache(url, options = {}) {
    if (cache.has(url)) {
        const cached = await cache.get(url);
        if (cached.expirationTime <= Date.now())
            return cached.data;
    }

    const response = await fetch(url, options);
    const data = await response.json();

    cache.set(url, {
        expirationTime: Date.now() + 300,
        data
    });

    return data;
}

export function removeFromCache(url) {
    cache.delete(url);
}