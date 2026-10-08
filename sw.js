const CACHE_NAME = 'joyanta-portfolio-v8';
const urlsToCache = [
    './',
    './index.html',
    './tailwind.css',
    './style.css',
    './script.js',
    './manifest.json',
    './404.html',
    './humans.txt',
    './llms.txt',
    './robots.txt',
    './sitemap.xml',
    './.well-known/security.txt',
    './joyanta-deb-gupta-cv.pdf',
    './icons/icon-192.jpg',
    './icons/icon-512.jpg',
    './icons/icon-192-maskable.jpg',
    './icons/icon-512-maskable.jpg',
    './icons/apple-touch-icon.jpg',
    './images/portrait.jpg',
    './images/portrait-400.jpg',
    './images/hero-bg.jpg',
    './images/hero-bg-960.jpg',
    './images/og-cover.jpg',
    './images/project-nesco.jpg',
    './images/project-nesco-640.jpg',
    './images/project-industrial.jpg',
    './images/project-industrial-640.jpg',
    './images/project-desco.jpg',
    './images/project-desco-640.jpg',
    './images/demo-compliance.jpg',
    './images/demo-compliance-640.jpg',
    './images/demo-pgcb.jpg',
    './images/demo-pgcb-640.jpg',
    './images/demo-cox.jpg',
    './images/demo-cox-640.jpg',
    './images/demo-parliament.jpg',
    './images/demo-parliament-640.jpg',
    './images/demo-solar.jpg',
    './images/demo-solar-640.jpg',
    './images/demo-tender.jpg',
    './images/demo-tender-640.jpg'
];

// Install event - cache same-origin files only (addAll is atomic, so keep it local).
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(() => {})
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                    return Promise.resolve(false);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Offline fallback page (never resolves to undefined)
function offlineFallback() {
    return caches.match('./index.html').then(cached => {
        if (cached) return cached;
        return caches.match('./404.html').then(notFound => {
            if (notFound) return notFound;
            return new Response('You are offline and the cached page is unavailable.', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
            });
        });
    });
}

// Fetch event:
// - HTML navigations: network-first (always fresh after deploys), cache fallback offline.
// - Static same-origin GET assets: stale-while-revalidate.
// - Non-GET and cross-origin: pass through, never cache.
self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    const isSameOrigin = url.origin === self.location.origin;

    // Navigation / HTML: network first
    if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
                    }
                    return networkResponse;
                })
                .catch(() => offlineFallback())
        );
        return;
    }

    // Only runtime-cache same-origin GET assets
    if (!isSameOrigin) return;

    event.respondWith(
        caches.match(request).then(cached => {
            const networkFetch = fetch(request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const copy = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
                }
                return networkResponse;
                // NOTE: subresources never fall back to HTML pages — a failed
                // image/font must not resolve to text/html (breaks rendering).
            }).catch(() => cached || new Response('', { status: 503, statusText: 'Offline' }));
            return cached || networkFetch;
        })
    );
});
