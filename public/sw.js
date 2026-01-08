// ============================================
// FILE: public/sw.js
// Service Worker for PWA & Performance
// ============================================

const CACHE_NAME = 'cybev-v5.6.0';
const STATIC_CACHE = 'cybev-static-v5.6.0';
const DYNAMIC_CACHE = 'cybev-dynamic-v5.6.0';
const IMAGE_CACHE = 'cybev-images-v5.6.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/feed',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API requests (always network-first)
  if (url.pathname.startsWith('/api/') || url.origin.includes('api.cybev.io')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Images - cache first, then network
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Static assets - cache first
  if (url.pathname.match(/\.(js|css|woff2|woff)$/) || STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML pages - network first, cache as fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default - stale while revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// Cache strategies
async function cacheFirst(request, cacheName = STATIC_CACHE) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return caches.match('/offline');
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'New notification',
      icon: data.icon || '/logo-192.png',
      badge: '/badge-72.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || [],
      tag: data.tag || 'cybev-notification',
      renotify: true
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'CYBEV', options)
    );
  } catch (error) {
    console.error('[SW] Push error:', error);
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data || {};
  let url = '/';
  
  // Route based on notification type
  if (data.type === 'message') {
    url = `/messages/${data.conversationId || ''}`;
  } else if (data.type === 'follow') {
    url = `/profile/${data.userId || ''}`;
  } else if (data.type === 'like' || data.type === 'comment') {
    url = data.blogId ? `/blog/${data.blogId}` : `/post/${data.postId || ''}`;
  } else if (data.type === 'live') {
    url = `/live/${data.streamId || ''}`;
  } else if (data.url) {
    url = data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing window if available
        for (const client of windowClients) {
          if (client.url.includes('cybev.io') && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // Open new window
        return clients.openWindow(url);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPendingPosts());
  }
});

async function syncPendingPosts() {
  // Get pending posts from IndexedDB and sync
  console.log('[SW] Syncing pending posts...');
}

console.log('[SW] Service Worker loaded - CYBEV v5.6.0');
