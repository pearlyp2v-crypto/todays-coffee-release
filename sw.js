/* Generated release data is inserted by scripts/build.py. */
const RELEASE = {"version": "3.8.16", "id": "3.8.16-5c67a5ff40908fcc-5de197d3a7781c1a", "files": {"index.html": "5de197d3a7781c1a3813a1015b6f22afdced54ab4075b828cf79fef284073031", "manifest.webmanifest": "9dbd9a807df1b2f2a795a865bea4082d06dbf11979074d9f85e6f813c6460fc6", "icons/apple-touch-icon.png": "41a26242723cb918a90c4f6a3a482b106da951df276c9c231783eba875e351ec", "icons/favicon-32.png": "0aa0a36a53c6303ac959754b0603a5dab1737e37dc1f1e5a76209de0472b7873", "icons/icon-192.png": "4949ec394f757ebb0a876f824565bd203f140381f5dedf40e074a1fb243cb3f5", "icons/icon-512.png": "2d1cbc0f6ae3ee0ccff96cffc3c48e7d94bca8a43b43c2e4a12630c4c5826512"}};
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
