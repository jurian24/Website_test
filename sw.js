const CACHE_NAME = "site-cache-v1";

const ASSETS_TO_CACHE = [
  "./",                 // root (index.html)
  "./index.html",
  "./manifest.json",
  "./images/logo192.png"
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

// Fetch event: cache first, fallback to network
self.addEventListener("fetch", e => {
  console.log("[Service Worker] Intercepting fetch request for:", e.request.url);
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
