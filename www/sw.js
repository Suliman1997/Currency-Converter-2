const CACHE_NAME = 'currency-converter-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// تثبيت: خزّن الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// تفعيل: احذف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// طلبات الشبكة: الكاش أولاً، ثم الإنترنت
self.addEventListener('fetch', event => {
  // طلبات API أسعار الصرف: الإنترنت أولاً
  if (event.request.url.includes('open.er-api.com')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  // باقي الملفات: الكاش أولاً
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
