const CACHE_NAME = 'fintodo-v4';

const STATIC_ASSETS = [
  '/fintodo/',
  '/fintodo/index.html',
  '/fintodo/manifest.json',
  '/fintodo/logo_app.png',
  '/fintodo/css/style.css',
  '/fintodo/js/app.js'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(networkRes => {
          // CDN & external tetap dicache DI SINI (aman)
          if (event.request.url.startsWith('http')) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then(cache =>
              cache.put(event.request, clone)
            );
          }
          return networkRes;
        })
        .catch(() => caches.match('/fintodo/index.html'));
    })
  );
});
