// Safe standard Service Worker for VeriPest PWA Installation
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass-through for real-time asset loading and fetch API calls
  event.respondWith(fetch(event.request));
});
