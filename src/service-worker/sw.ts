declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';

var version = "v0.1.0"
var staticCacheName = version + "_pwa-wt-static";
var dynamicCacheName = version + "_pwa-wt-dynamic";

precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('install', () => void self.skipWaiting());
self.addEventListener('activate', () => void self.clients.claim());

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const deletionPromises = cacheNames
        .filter(cacheName => 
          !cacheName.startsWith(staticCacheName) && 
          !cacheName.startsWith(dynamicCacheName)
        )
        .map(async cacheName => {
          console.log('Removing old cache:', cacheName);
          await caches.delete(cacheName);
          
          // Deregister the service worker for iOS to get changes too
          if ('serviceWorker' in navigator) {
            const serviceWorkerContainer = navigator.serviceWorker as ServiceWorkerContainer;
            const registrations = await serviceWorkerContainer.getRegistrations();
            for (const registration of registrations) {
              console.log('Deregistering ServiceWorker');
              await registration.unregister();
            }
            window.location.reload();
          }
        });

      return Promise.all(deletionPromises);
    })()
  );
});
