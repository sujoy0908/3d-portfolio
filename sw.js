const CACHE_NAME = '3d-portfolio-v6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './404.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './data/portfolio.json',
  './data/private.json',
  './data/settings.json',
  './admin/',
  // Note: we let dynamic caching handle /assets/uploads/ contents
  // External resources can also be cached, though large 3D models should probably not be cached aggressively
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Outfit:wght@400;700;900&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Dynamically cache images as the user browses
        const url = new URL(event.request.url);
        if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i) || event.request.destination === 'image') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // If both cache and network fail, and it's an HTML request, fallback to index
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
