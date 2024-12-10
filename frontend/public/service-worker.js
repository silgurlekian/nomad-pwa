const CACHE_NAME = 'nomad-pwa-cache-v1';
const urlsToCache = [
  '/pwa/',
  '/pwa/icons/192x192.png',
  '/pwa/icons/512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché creado y archivos añadidos.');
        return cache.addAll(urlsToCache)
          .catch(error => {
            console.error('Error al añadir archivos a la caché:', error);
          });
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar solicitudes de red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .catch(error => {
            console.error('Error al recuperar la solicitud:', error);
          });
      })
  );
});
