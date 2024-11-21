const apiBaseUrl = "https://api-nomad.onrender.com";

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname === "127.0.0.1"
);

export function register() {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const swUrl = `${process.env.PUBLIC_URL || apiBaseUrl}/service-worker.js`;

    window.addEventListener("load", () => {
      if (isLocalhost) {
        // En entorno local, verifica el Service Worker.
        checkValidServiceWorker(swUrl);
      } else {
        // En producción, registra el Service Worker directamente.
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log("Service Worker registrado con éxito:", registration);

      // Opción: Manejar actualizaciones del Service Worker.
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                console.log("Nuevo contenido disponible; recarga la página.");
              } else {
                console.log("Contenido en caché para uso sin conexión.");
              }
            }
          };
        }
      };
    })
    .catch((error) => {
      console.error("Error al registrar el Service Worker:", error);
    });
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl, { headers: { "Service-Worker": "script" } })
    .then((response) => {
      if (
        response.status === 404 ||
        response.headers.get("content-type")?.indexOf("javascript") === -1
      ) {
        // Si no se encuentra el Service Worker, desregístralo.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            console.log("Service Worker no válido, recargando página.");
            window.location.reload();
          });
        });
      } else {
        // Si es válido, regístralo.
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log("No se puede acceder al Service Worker.");
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister().then(() => {
          console.log("Service Worker desregistrado.");
        });
      })
      .catch((error) => {
        console.error("Error al desregistrar el Service Worker:", error);
      });
  }
}
