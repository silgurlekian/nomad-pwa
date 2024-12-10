// Nombre del caché
const CACHE_NAME = 'nomad-cache-v1.1';

// Archivos a almacenar en caché
const urlsToCache = [
  'https://pwa.nomad.com.ar/',
  'https://pwa.nomad.com.ar/index.html',
  'https://pwa.nomad.com.ar/styles.css',
  'https://pwa.nomad.com.ar/app.js',
  'https://pwa.nomad.com.ar/assets/logo.png',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Instalando el Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Archivos en caché correctamente');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Activando el Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          // Elimina cachés antiguas que no coinciden con el CACHE_NAME actual
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
