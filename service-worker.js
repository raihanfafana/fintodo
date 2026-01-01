const CACHE_NAME = "fintodo-cache-v3";
const FILES_TO_CACHE = [
  "/fintodo/",
  "/fintodo/index.html",
  "/fintodo/manifest.json",
  "/fintodo/css/style.css",
  "/fintodo/js/app.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).catch(() => {
          return caches.match("/fintodo/index.html");
        });
      })
  );
});
