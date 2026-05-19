/**
 * USL Admin - Service Worker
 * Enables PWA functionality for admin panel
 *
 * Cache strategy (zero-maintenance):
 * - Navigation (HTML): Network First → Cache Fallback
 * - Static assets: Stale-While-Revalidate (serve cached, update in bg)
 * - Firebase/API: Network Only
 */

const CACHE_NAME = 'usl-admin';
const BASE_PATH = '/usl-ev-landing-v2';
const STATIC_ASSETS = [
  `${BASE_PATH}/admin/index.html`,
  `${BASE_PATH}/admin/styles.css`,
  `${BASE_PATH}/admin/script.js`,
  `${BASE_PATH}/admin/firebase-config.js`
];

// Install: Cache static assets for offline use
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

// Activate: Clean all old caches (if format changes in future)
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

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Firebase/API requests: Network Only — never cache
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis') ||
      url.pathname.includes('firebase-config')) {
    event.respondWith(fetch(request));
    return;
  }

  // Navigation (HTML): Network First → Cache Fallback
  // Always try network first for the latest code, cache as backup
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        // Cache the fresh HTML for offline use
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Offline: serve cached version
        return caches.match(`${BASE_PATH}/admin/index.html`);
      })
    );
    return;
  }

  // Static assets (JS, CSS, etc.): Stale-While-Revalidate
  // Serve cached instantly, update in background for next time
  event.respondWith(
    caches.match(request).then((cached) => {
      // Fetch network version in parallel
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok && request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);

      // Return cached if available (instant), otherwise wait for network
      return cached || fetchPromise;
    })
  );
});
