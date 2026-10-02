const CACHE = 'msp-v3';
const FILES = ['./', 'index.html', 'css/style.css', 'js/data-scenarios.js', 'js/data-referentiels.js', 'js/data-doctrine.js', 'js/engine.js', 'js/ai.js', 'js/store.js', 'js/app.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'fonts/jetbrains-mono-latin-400.woff2', 'fonts/jetbrains-mono-latin-500.woff2', 'fonts/jetbrains-mono-latin-700.woff2', 'fonts/jetbrains-mono-latin-ext-400.woff2', 'fonts/jetbrains-mono-latin-ext-500.woff2', 'fonts/jetbrains-mono-latin-ext-700.woff2'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // les appels à Gemini ne passent jamais par le cache
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
