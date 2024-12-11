const CACHE_NAME = "nomad-pwa-cache-v1";
const urlsToCache = [
  "/pwa/index.html",
  "/pwa/manifest.json",
  "/pwa/icons/192x192.png",
  "/pwa/icons/512x512.png",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("nomad-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/pwa/manifest.json",
        "/pwa/images/icon-192x192.png",
        "/pwa/images/icon-512x512.png",
        "/pwa/css/styles.css",
        "/pwa/js/main.js",
      ]);
    })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Eliminando caché antigua:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar solicitudes de red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
