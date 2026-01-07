// ============================================
// FILE: public/sw.js
// Service Worker - Fixed Response Cloning
// VERSION: 2.0
// ============================================

const CACHE_NAME = 'cybev-cache-v2';
const OFFLINE_URL = '/offline';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, then network (for static assets)
  cacheFirst: ['fonts.googleapis.com', 'fonts.gstatic.com', '.woff2', '.woff', '.ttf'],
  
  // Network first, then cache (for API calls)
  networkFirst: ['/api/'],
  
  // Stale while revalidate (for images, CSS, JS)
  staleWhileRevalidate: ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']
};

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] Precache failed:', err))
  );
});

// Activate event
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
      .then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Skip WebSocket connections
  if (request.url.includes('/socket.io/')) {
    return;
  }
  
  // Determine caching strategy based on URL
  const strategy = getCacheStrategy(request.url);
  
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

// Determine which cache strategy to use
function getCacheStrategy(url) {
  for (const pattern of CACHE_STRATEGIES.cacheFirst) {
    if (url.includes(pattern)) return 'cacheFirst';
  }
  for (const pattern of CACHE_STRATEGIES.networkFirst) {
    if (url.includes(pattern)) return 'networkFirst';
  }
  for (const pattern of CACHE_STRATEGIES.staleWhileRevalidate) {
    if (url.includes(pattern)) return 'staleWhileRevalidate';
  }
  return 'networkFirst';
}

// Cache First Strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Only cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      // Clone BEFORE using the response
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return caches.match(OFFLINE_URL);
  }
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Only cache successful GET responses for HTML pages
    if (networkResponse.ok && request.destination === 'document') {
      const cache = await caches.open(CACHE_NAME);
      // Clone BEFORE using the response
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL);
    }
    
    // Return error response for other requests
    return new Response('Network error', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale While Revalidate Strategy (FIXED)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await caches.match(request);
  
  // Start network fetch in background
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      // Only cache successful responses
      if (networkResponse.ok) {
        // Clone BEFORE storing in cache
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.error('[SW] Revalidate fetch failed:', error);
      return null;
    });
  
  // Return cached response immediately, or wait for network
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // No cached response, wait for network
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  // Both failed
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  let data = {
    title: 'CYBEV',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png'
  };
  
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    console.error('[SW] Push data parse error:', e);
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now()
    },
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
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

// Background sync for offline posts
self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);
  
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

async function syncPosts() {
  try {
    // Get pending posts from IndexedDB
    const db = await openDB();
    const pendingPosts = await db.getAll('pending-posts');
    
    for (const post of pendingPosts) {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${post.token}`
          },
          body: JSON.stringify(post.data)
        });
        
        if (response.ok) {
          await db.delete('pending-posts', post.id);
          console.log('[SW] Synced post:', post.id);
        }
      } catch (err) {
        console.error('[SW] Failed to sync post:', post.id, err);
      }
    }
  } catch (err) {
    console.error('[SW] Sync posts error:', err);
  }
}

// Simple IndexedDB wrapper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('cybev-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      resolve({
        getAll: (store) => new Promise((res, rej) => {
          const tx = db.transaction(store, 'readonly');
          const req = tx.objectStore(store).getAll();
          req.onsuccess = () => res(req.result);
          req.onerror = () => rej(req.error);
        }),
        delete: (store, key) => new Promise((res, rej) => {
          const tx = db.transaction(store, 'readwrite');
          const req = tx.objectStore(store).delete(key);
          req.onsuccess = () => res();
          req.onerror = () => rej(req.error);
        })
      });
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-posts')) {
        db.createObjectStore('pending-posts', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

console.log('[SW] Service worker loaded');
