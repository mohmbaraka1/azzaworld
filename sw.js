/* =====================================================
   AZZA Service Worker — v1.0
   يحفظ الملفات للعمل بدون إنترنت
   ===================================================== */

const CACHE = 'azza-v1';
const OFFLINE_PAGE = '/azzaworld/login.html';

/* الملفات الأساسية — تُحفظ عند أول تثبيت */
const CORE_FILES = [
  '/azzaworld/app.html',
  '/azzaworld/login.html',
  '/azzaworld/academy.html',
  '/azzaworld/explore.html',
  '/azzaworld/dashboard.html',
  '/azzaworld/ai-assistant.html',
  '/azzaworld/certificates.html',
  '/azzaworld/messages.html',
  '/azzaworld/profile.html',
  '/azzaworld/settings.html',
  '/azzaworld/notifications.html',
  '/azzaworld/course.html',
  '/azzaworld/cv.html',
  '/azzaworld/supabase.js',
  '/azzaworld/manifest.json',
  '/azzaworld/icons/icon-192.png',
  '/azzaworld/icons/icon-512.png',
];

/* ── Install ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE_FILES.map(f => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Install cache error:', err))
  );
});

/* ── Activate ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch Strategy ── */
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  /* 1) Supabase & APIs → Network Only (لا كاش) */
  if (url.hostname.includes('supabase.co') ||
      url.hostname.includes('anthropic.com') ||
      url.hostname.includes('googleapis.com')) {
    e.respondWith(fetch(request).catch(() => new Response('{"error":"offline"}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  /* 2) خرائط Tiles → Network First, fallback Cache */
  if (url.hostname.includes('cartocdn.com') ||
      url.hostname.includes('openfreemap.org') ||
      url.hostname.includes('tile.openstreetmap.org')) {
    e.respondWith(
      fetch(request)
        .then(res => { const c = res.clone(); caches.open(CACHE+'tiles').then(cache => cache.put(request, c)); return res; })
        .catch(() => caches.match(request))
    );
    return;
  }

  /* 3) HTML/JS/CSS → Cache First, fallback Network */
  e.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;
        return fetch(request)
          .then(res => {
            if (res.ok) {
              const c = res.clone();
              caches.open(CACHE).then(cache => cache.put(request, c));
            }
            return res;
          })
          .catch(() => caches.match(OFFLINE_PAGE));
      })
  );
});

/* ── Push Notifications (مستقبلاً) ── */
self.addEventListener('push', e => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || 'AZZA', {
      body: data.body || '',
      icon: '/azzaworld/icons/icon-192.png',
      badge: '/azzaworld/icons/icon-96.png',
      dir: 'rtl',
      lang: 'ar',
      data: { url: data.url || '/azzaworld/app.html' },
      actions: [
        { action: 'open', title: 'فتح' },
        { action: 'close', title: 'إغلاق' }
      ]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/azzaworld/app.html'));
});