/**
 * USL Admin - Service Worker
 * Enables PWA functionality for admin panel
 */

const CACHE_NAME = 'usl-admin-v1';
const STATIC_ASSETS = [
  '/admin/index.html',
  '/admin/styles.css',
  '/admin/script.js',
  '/admin/firebase-config.js'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => {
      console.log('Cache install failed:', err);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first, cache fallback for API; Cache first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Firebase/API requests: Network only
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis') ||
      url.pathname.includes('firebase-config')) {
    event.respondWith(fetch(request));
    return;
  }

  // Static assets: Cache first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).then((response) => {
        // Cache successful GET requests
        if (response.ok && request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      });
    }).catch(() => {
      // Fallback for HTML pages
      if (request.mode === 'navigate') {
        return caches.match('/admin/index.html');
      }
    })
  );
});
