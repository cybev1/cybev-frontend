// ============================================
// FILE: src/services/OfflineService.js
// Offline Support & Data Caching Service
// ============================================

const CACHE_PREFIX = 'cybev_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

class OfflineService {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.listeners = [];
    this.pendingActions = [];
    this.initializeListeners();
  }

  // Initialize online/offline listeners
  initializeListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners('online');
      this.processPendingActions();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners('offline');
    });
  }

  // Check if device is online
  checkOnline() {
    return this.isOnline;
  }

  // Add status change listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners
  notifyListeners(status) {
    this.listeners.forEach(listener => listener(status));
  }

  // Cache data with expiry
  async cacheData(key, data, expiryMs = CACHE_EXPIRY) {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + expiryMs
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheItem));
      return true;
    } catch (error) {
      console.error('Cache error:', error);
      return false;
    }
  }

  // Get cached data
  getCachedData(key) {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const cacheItem = JSON.parse(cached);
      
      // Check if expired
      if (Date.now() > cacheItem.expiry) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Get cache error:', error);
      return null;
    }
  }

  // Remove cached data
  removeCachedData(key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  }

  // Clear all cached data
  clearAllCache() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Fetch with offline fallback
  async fetchWithCache(url, options = {}, cacheKey = null) {
    const key = cacheKey || url;

    // If online, try to fetch
    if (this.isOnline) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          // Cache the response
          this.cacheData(key, data);
          return { data, fromCache: false, online: true };
        }
      } catch (error) {
        console.log('Fetch failed, trying cache:', error.message);
      }
    }

    // Try to get from cache
    const cachedData = this.getCachedData(key);
    if (cachedData) {
      return { data: cachedData, fromCache: true, online: this.isOnline };
    }

    // No cache available
    throw new Error('No data available offline');
  }

  // Queue action for when online
  queueAction(action) {
    const queuedAction = {
      id: Date.now(),
      action,
      timestamp: Date.now()
    };

    this.pendingActions.push(queuedAction);
    this.savePendingActions();

    // If online, process immediately
    if (this.isOnline) {
      this.processPendingActions();
    }

    return queuedAction.id;
  }

  // Save pending actions to localStorage
  savePendingActions() {
    localStorage.setItem('cybev_pending_actions', JSON.stringify(this.pendingActions));
  }

  // Load pending actions from localStorage
  loadPendingActions() {
    try {
      const saved = localStorage.getItem('cybev_pending_actions');
      this.pendingActions = saved ? JSON.parse(saved) : [];
    } catch (error) {
      this.pendingActions = [];
    }
  }

  // Process pending actions when online
  async processPendingActions() {
    if (!this.isOnline || this.pendingActions.length === 0) return;

    this.loadPendingActions();
    const actions = [...this.pendingActions];
    this.pendingActions = [];

    for (const item of actions) {
      try {
        await item.action();
      } catch (error) {
        console.error('Failed to process pending action:', error);
        // Re-queue failed action
        this.pendingActions.push(item);
      }
    }

    this.savePendingActions();
  }

  // Cache user data for offline access
  async cacheUserData(userId) {
    if (!this.isOnline) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Cache user profile
      const profileRes = await fetch(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        this.cacheData(`user_${userId}`, profile);
      }

      // Cache user's blogs
      const blogsRes = await fetch(`/api/blogs/user/${userId}?limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (blogsRes.ok) {
        const blogs = await blogsRes.json();
        this.cacheData(`user_blogs_${userId}`, blogs);
      }

      // Cache feed
      const feedRes = await fetch('/api/feed?limit=20', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (feedRes.ok) {
        const feed = await feedRes.json();
        this.cacheData('feed', feed);
      }

      console.log('User data cached for offline access');
    } catch (error) {
      console.error('Failed to cache user data:', error);
    }
  }

  // Get offline-capable blog content
  async getBlog(blogId) {
    return this.fetchWithCache(
      `/api/blogs/${blogId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
      `blog_${blogId}`
    );
  }

  // Get offline-capable feed
  async getFeed() {
    return this.fetchWithCache(
      '/api/feed?limit=20',
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
      'feed'
    );
  }

  // Queue a like action for when online
  queueLike(blogId) {
    return this.queueAction(async () => {
      const token = localStorage.getItem('token');
      await fetch(`/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    });
  }

  // Queue a comment for when online
  queueComment(blogId, content) {
    return this.queueAction(async () => {
      const token = localStorage.getItem('token');
      await fetch(`/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ blogId, content })
      });
    });
  }

  // Get cache statistics
  getCacheStats() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    let totalSize = 0;

    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) totalSize += value.length * 2; // UTF-16 encoding
    });

    return {
      itemCount: keys.length,
      totalSize: totalSize,
      sizeFormatted: this.formatBytes(totalSize),
      pendingActions: this.pendingActions.length
    };
  }

  // Format bytes to human readable
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
const offlineService = new OfflineService();
export default offlineService;

// Also export class
export { OfflineService };
