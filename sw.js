const CACHE_NAME = 'silsilah-pro-v1.0.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/js/api.js',
  './assets/js/tree.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://d3js.org/d3.v7.min.js'
];

// Install Service Worker & Simpan Assets ke Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Strategi: Network First, Fallback to Cache
// Karena data keluarga sering berubah, kita coba ambil dari internet dulu
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
