const CACHE_NAME = "topik-v3";
const urlsToCache = ["./", "./index.html", "./logo.png", "./vocabs.txt"];
// ================= INSTALL =================
self.addEventListener("install", (event) => {
  self.skipWaiting(); // update ngay
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// ================= ACTIVATE =================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // xóa cache cũ
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

// ================= FETCH =================
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ✅ bỏ qua request không phải http/https
  if (!req.url.startsWith("http")) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, res.clone());
          return res;
        });
      });
    }),
  );
});
