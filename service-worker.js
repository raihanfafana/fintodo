const CACHE_NAME = 'fintodo-v4';

const STATIC_ASSETS = [
  '/fintodo/',
  '/fintodo/index.html',
  '/fintodo/manifest.json',
  '/fintodo/logo_app.png',
  '/fintodo/css/style.css',
  '/fintodo/js/app.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// ACTIVATE (hapus cache lama)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH (STRATEGY: Cache First → Network Fallback)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(res => {
      return (
        res ||
        fetch(event.request)
          .then(networkRes => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkRes.clone());
              return networkRes;
            });
          })
          .catch(() => caches.match('/fintodo/index.html'))
      );
    })
  );
});
