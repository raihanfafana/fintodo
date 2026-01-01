const CACHE_NAME = 'fintodo-v2';

const ASSETS = [
  '/',
  '/fintodo/index.html',
  '/fintodo/css/style.css',
  '/fintodo/js/app.js',
  '/fintodo/logo_app.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});
