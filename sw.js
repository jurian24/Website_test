const CACHE_NAME = "site-cache-v1";
const ASSETS_TO_CACHE = [
  "/", // root (index.html)
  "/index.html",
];

// Install event: cache de bestanden
self.addEventListener("install", event => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[Service Worker] Caching files");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event: oude caches verwijderen
self.addEventListener("activate", event => {
  console.log("[Service Worker] Activate");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch event: eerst cache, dan netwerk
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
