const CACHE_NAME = "nomad-pwa-cache-v2.2"; 
const urlsToCache = [
  "/pwa/",
  "/pwa/index.html",
  "/pwa/manifest.json",
  "/pwa/icons/192x192.png",
  "/pwa/icons/512x512.png",
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

// Interceptar solicitudes de red y manejar errores en fetch
self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url); // Log para depuración

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si se encuentra en caché, retornar la respuesta
        if (response) {
          return response;
        }

        // Si no está en caché, hacer el fetch
        return fetch(event.request)
          .catch((error) => {
            console.error("Error al obtener el recurso:", error);
            // Retornar una página de fallback en caso de error
            return caches.match('/pwa/offline.html');
          });
      })
  );
});

// Escuchar el mensaje para forzar la actualización
self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting(); // Forzar la activación del nuevo service worker
  }
});
