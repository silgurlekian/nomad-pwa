const CACHE_NAME = "nomad-pwa-cache-v2.2"; 
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/192x192.png",
  "/icons/512x512.png",
].map((url) => new URL(url, self.location).href);

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado.");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return Promise.all(urlsToCache.map((url) => cache.add(url)));
      })
      .catch((error) => console.error("Error al instalar el cache:", error))
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Usa la versión actual del caché
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Eliminar cachés no deseados
          }
        })
      );
    })
  );

  // Notificar a los clientes sobre la actualización
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ action: "updateAvailable" });
    });
  });
});

// Interceptar solicitudes de red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request); // Retornar caché o hacer fetch
    })
  );
});

// Escuchar el mensaje para forzar la actualización
self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting(); // Forzar la activación del nuevo service worker
  }
});
