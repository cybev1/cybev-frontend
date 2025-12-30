// ============================================
// CYBEV Service Worker v1.0.0
// Provides offline support and caching
// ============================================

const CACHE_NAME = 'cybev-v1.0.0';
const OFFLINE_URL = '/offline';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/feed',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, fall back to network
  cacheFirst: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
    /\.(?:woff|woff2|ttf|otf|eot)$/,
    /\/icons\//,
    /\/images\//
  ],
  // Network first, fall back to cache
  networkFirst: [
    /\/api\//,
    /\/feed/,
    /\/blog/,
    /\/post/,
    /\/profile/
  ],
  // Stale while revalidate
  staleWhileRevalidate: [
    /\.(?:js|css)$/,
    /\/_next\/static\//
  ]
};

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests (except CDN assets)
  if (url.origin !== self.location.origin && !url.hostname.includes('cdn')) {
    return;
  }
  
  // Determine cache strategy
  const strategy = getCacheStrategy(url.pathname);
  
  switch (strategy) {
    case 'cacheFirst':
      event.respondWith(cacheFirst(request));
      break;
    case 'networkFirst':
      event.respondWith(networkFirst(request));
      break;
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request));
      break;
    default:
      event.respondWith(networkFirst(request));
  }
});

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    
    return new Response('Network error', { status: 503 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, networkResponse.clone());
      });
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Determine which strategy to use based on URL
function getCacheStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    for (const pattern of patterns) {
      if (pattern.test(pathname)) {
        return strategy;
      }
    }
  }
  return 'networkFirst';
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let data = { title: 'CYBEV', body: 'You have a new notification' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body || data.message,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/notifications',
      dateOfArrival: Date.now()
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    tag: data.tag || 'cybev-notification',
    renotify: true
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/notifications';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing window if available
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
  
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  }
});

// Sync queued posts when back online
async function syncPosts() {
  try {
    const db = await openIndexedDB();
    const posts = await getAllFromStore(db, 'pendingPosts');
    
    for (const post of posts) {
      try {
        await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post.data)
        });
        await deleteFromStore(db, 'pendingPosts', post.id);
      } catch (error) {
        console.error('[SW] Failed to sync post:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync posts failed:', error);
  }
}

// Sync queued comments when back online
async function syncComments() {
  try {
    const db = await openIndexedDB();
    const comments = await getAllFromStore(db, 'pendingComments');
    
    for (const comment of comments) {
      try {
        await fetch(`/api/comments/${comment.postId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(comment.data)
        });
        await deleteFromStore(db, 'pendingComments', comment.id);
      } catch (error) {
        console.error('[SW] Failed to sync comment:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync comments failed:', error);
  }
}

// IndexedDB helpers for offline queue
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('cybev-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingPosts')) {
        db.createObjectStore('pendingPosts', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('pendingComments')) {
        db.createObjectStore('pendingComments', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getAllFromStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteFromStore(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

console.log('[SW] Service worker loaded');
