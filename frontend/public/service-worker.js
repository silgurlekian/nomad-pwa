// Nombre del caché
const CACHE_NAME = 'nomad-cache-v1';

// Archivos a almacenar en caché
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/assets/logo.png',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Archivos en caché correctamente');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          // Elimina cachés antiguas
          if (cache !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Intercepción de solicitudes de red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devuelve la respuesta desde la caché si existe, o hace la solicitud a la red
      return response || fetch(event.request);
    })
  );
});
