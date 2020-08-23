workbox.core.setCacheNameDetails({ prefix: 'cryptomkt-bot-pwa' });

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

addEventListener('message', (messageEvent) => {
  if (messageEvent.data === 'skipWaiting') return self.skipWaiting();
});
