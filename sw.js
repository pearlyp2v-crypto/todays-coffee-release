/* Generated release data is inserted by scripts/build.py. */
const RELEASE = {"version": "3.9.14", "id": "3.9.14-8aaea4371357361a-87b0febf3e715319", "files": {"index.html": "87b0febf3e715319f81f79773c38af86af8bca112b674e0a624b33145d698556", "manifest.webmanifest": "9dbd9a807df1b2f2a795a865bea4082d06dbf11979074d9f85e6f813c6460fc6", "icons/apple-touch-icon.png": "bb1aacc666eb1ba6b9b715fed95bc04beb53930f3374d2edb33b25a0fbf05293", "icons/favicon-32.png": "1d9d44831b3d6f6aaaccdff57c4d0501e20933b91ba12ecf5813ef310b9aade8", "icons/icon-192.png": "55a97f8059d41e97c43cced1f6b06133c865b277dcb76fb0e8da3213b7758541", "icons/icon-512.png": "e70c4a097c12bc2933781e18b356cb8efda9245838201a1dbd6c14c5c7d7918f"}};
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
