const generalCache = new Map;
const userCaches = new Map;

async function fetchWithCache(cache, url, options = {}) {
    if (cache.has(url)) {
        const cached = await cache.get(url);
        if (Date.now() <= cached.expirationTime)
            return cached.data;
    }

    const response = await fetch(url, options);
    const data = await response.json();

    cache.set(url, {
        expirationTime: Date.now() + 300000,
        data
    });

    return data;
}

export async function fetchWithGeneralCache(url, options = {}) {
    return await fetchWithCache(generalCache, url, options);
}

export async function fetchWithUserCache(token, url, options = {}) {
    if (!userCaches.has(token))
        userCaches.set(token, new Map);

    const cache = userCaches.get(token);
    return await fetchWithCache(cache, url, options);
}

export function removeUserCache(token) {
    userCaches.delete(token);
}