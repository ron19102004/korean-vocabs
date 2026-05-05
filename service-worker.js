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
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // clone để cache
        const clone = res.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });

        return res;
      })
      .catch(() => {
        return caches.match(event.request);
      }),
  );
});
