const CACHE_NAME = "site-cache-v1";

const ASSETS_TO_CACHE = [
  "./",                 // root (index.html)
  "./index.html",
  "./src/manifest.json",
  "./src/icons/rekenmachine.png"
];

// Install event: cache de bestanden
self.addEventListener("install", event => {
  console.log("[Service Worker] Install & caching resources...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      console.log("[Service Worker] Resources cached successfully.");
    }).catch(err => {
      console.error("[Service Worker] Failed to cache resources:", err);
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
            .map(key => {
              console.log("[Service Worker] Deleting old cache:", key);
              return caches.delete(key);
            })
      )
    )
  );
});

// Fetch event: eerst cache, dan netwerk
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log("[Service Worker] Serving from cache:", event.request.url);
        return response;
      }
      console.log("[Service Worker] Fetching from network:", event.request.url);
      return fetch(event.request);
    })
  );
});
