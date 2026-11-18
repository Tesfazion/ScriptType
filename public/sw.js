const CACHE_NAME = "scripttype-shell-v1";
const APP_ROUTES = [
  "/",
  "/today",
  "/journeys",
  "/practice",
  "/trainer",
  "/progress",
  "/offline",
];
const STATIC_ASSETS = ["/manifest.json", "/scripttype-icon.svg"];
const OFFLINE_NAVIGATIONS = new Set([
  ...APP_ROUTES,
  "/sign-in",
  "/memory",
  "/audio",
  "/community",
  "/profile",
  "/reflection",
  "/settings",
]);

function normalizedPageRequest(request) {
  const url = new URL(request.url);
  return new Request(`${url.origin}${url.pathname}`);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll([...APP_ROUTES, ...STATIC_ASSETS]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("scripttype-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    const url = new URL(request.url);
    const isJourneyPage =
      url.pathname.startsWith("/journeys/") &&
      url.pathname.split("/").filter(Boolean).length === 2;
    if (!OFFLINE_NAVIGATIONS.has(url.pathname) && !isJourneyPage) return;
    const cacheRequest = normalizedPageRequest(request);
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(cacheRequest, copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(cacheRequest);
          return cachedPage ?? (await caches.match("/offline"));
        }),
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    STATIC_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      }),
    );
  }
});
