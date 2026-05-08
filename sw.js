// Service Worker minimal — cache-first sur l'app shell, network-first ailleurs.
// Permet à TrioInclusion de tourner hors-ligne (exigence PWA + Play Store).

const VERSION = "v1";
const CACHE   = `trioinclusion-${VERSION}`;
// Chemins relatifs pour fonctionner aussi sous /ga-l/ (GitHub Pages projet).
const BASE = new URL("./", self.registration.scope).pathname;
const SHELL = [
  "",
  "index.html",
  "privacy.html",
  "styles.css",
  "data.js",
  "app.js",
  "manifest.webmanifest",
  "icons/icon.svg",
].map(p => BASE + p);

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req)
        .then(res => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match("/index.html"));
      return cached || network;
    })
  );
});
