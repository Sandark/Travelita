import {precacheAndRoute} from 'workbox-precaching/precacheAndRoute'
import "core-js/stable";
import "regenerator-runtime/runtime";

precacheAndRoute(self.__WB_MANIFEST)

let cache_name = "travelita"

let urls_to_cache = [
    "./",
    "./tripsWithItems"
]

self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(cache_name).then((cache) => {
        return cache.addAll(urls_to_cache)
    }));
})

self.addEventListener("fetch", (e) => {
    e.respondWith(async function() {
        try {
            return await fetch(e.request);
        } catch (err) {
            return caches.match(e.request);
        }
    }());
})