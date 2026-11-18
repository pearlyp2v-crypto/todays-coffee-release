/* Generated release data is inserted by scripts/build.py. */
const RELEASE = {"version": "3.8.71", "id": "3.8.71-bacf8f098dd84acf-5ad202bb9a833f51", "files": {"index.html": "5ad202bb9a833f51890109f6cca3410f63a104244bbcddf3a83b3d1438c250af", "manifest.webmanifest": "9dbd9a807df1b2f2a795a865bea4082d06dbf11979074d9f85e6f813c6460fc6", "icons/apple-touch-icon.png": "dfbfe82ce35b0d8177d8b764b1b593d33a823cd2443a497b13ff4fd70d0578b5", "icons/favicon-32.png": "e87ecafe285b414a51bcb7d89a53c67e8480d1c1b3e9694f951c46031e5d25d3", "icons/icon-192.png": "adf171a206832e697429178a194a0d35e0592c3e1a5a5d6de24f476b02db95a8", "icons/icon-512.png": "54cff71712ecc3be34baf852262678f96a86602b01a8fdfa630521a11f4a5812"}};
const BASE = new URL(self.registration.scope);
const PREFIX = 'todays-coffee-shell:' + encodeURIComponent(BASE.pathname) + ':';
const CACHE = PREFIX + RELEASE.id;
const INDEX = new URL('index.html', BASE).href;
const ASSETS = new Map(Object.entries(RELEASE.files).map(([path, hash]) => [new URL(path, BASE).href, hash]));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      for (const [url, expected] of ASSETS) {
        const response = await fetch(url, {cache: 'no-store', credentials: 'same-origin'});
        if (!response.ok || response.redirected) throw new Error('Incomplete release: ' + url);
        const bytes = await response.clone().arrayBuffer();
        const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), x => x.toString(16).padStart(2, '0')).join('');
        if (digest !== expected) throw new Error('Release hash mismatch: ' + url);
        await cache.put(url, response);
      }
    } catch (error) {
      await caches.delete(CACHE);
      throw error;
    }
    // No automatic skipWaiting: existing tabs keep their current version.
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'APPLY_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== BASE.origin) return;
  const shellNavigation = request.mode === 'navigate' &&
    (url.pathname === BASE.pathname || url.pathname === new URL(INDEX).pathname);
  if (!shellNavigation && !ASSETS.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(shellNavigation ? INDEX : url.href);
    return cached || fetch(request);
  })());
});
