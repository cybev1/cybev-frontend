// ============================================
// FILE: src/utils/performance.js
// Performance Optimization Utilities
// VERSION: 1.0
// ============================================

// Debounce function - delays execution until after wait period
export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle function - limits execution to once per wait period
export function throttle(func, wait = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

// Memoization for expensive calculations
export function memoize(fn, getKey = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return function(...args) {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    return result;
  };
}

// Request Animation Frame throttle for scroll/resize
export function rafThrottle(callback) {
  let requestId = null;
  let lastArgs = null;

  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };

  return function throttled(...args) {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };
}

// Lazy load modules
export async function lazyLoad(importFn) {
  try {
    const module = await importFn();
    return module.default || module;
  } catch (error) {
    console.error('Failed to lazy load module:', error);
    throw error;
  }
}

// Prefetch data on hover/focus
export function prefetch(url, options = {}) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = options.as ? 'preload' : 'prefetch';
  link.href = url;
  if (options.as) link.as = options.as;
  if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
  document.head.appendChild(link);
}

// Intersection Observer helper
export function observeIntersection(element, callback, options = {}) {
  if (typeof IntersectionObserver === 'undefined') {
    callback(true); // Fallback for old browsers
    return () => {};
  }

  const observer = new IntersectionObserver(
    ([entry]) => callback(entry.isIntersecting, entry),
    {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    }
  );

  observer.observe(element);
  return () => observer.disconnect();
}

// Idle callback for non-critical tasks
export function runWhenIdle(callback, timeout = 2000) {
  if (typeof window === 'undefined') {
    callback();
    return;
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 1);
  }
}

// Connection-aware loading
export function getConnectionQuality() {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return 'unknown';
  }

  const { effectiveType, saveData } = navigator.connection;
  
  if (saveData) return 'save-data';
  if (effectiveType === '4g') return 'high';
  if (effectiveType === '3g') return 'medium';
  return 'low';
}

// Image loading quality based on connection
export function getImageQuality() {
  const quality = getConnectionQuality();
  switch (quality) {
    case 'save-data':
    case 'low':
      return 50;
    case 'medium':
      return 70;
    default:
      return 85;
  }
}

// Virtual list helper for large lists
export function getVisibleRange(containerHeight, itemHeight, scrollTop, overscan = 3) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  return { startIndex, endIndex };
}

// Batch DOM updates
export function batchUpdate(updates) {
  if (typeof window === 'undefined') {
    updates.forEach(fn => fn());
    return;
  }

  requestAnimationFrame(() => {
    const fragment = document.createDocumentFragment();
    updates.forEach(fn => fn(fragment));
  });
}

// Storage with expiry
export const storageWithExpiry = {
  set(key, value, ttl = 3600000) { // Default 1 hour
    if (typeof window === 'undefined') return;
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      // Storage full or unavailable
    }
  },
  
  get(key) {
    if (typeof window === 'undefined') return null;
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (e) {
      return null;
    }
  },
  
  remove(key) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

// Simple LRU Cache
export class LRUCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preconnect to critical domains
  const domains = [
    'https://api.cybev.io',
    'https://res.cloudinary.com',
    'https://stream.mux.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Export Web Vitals reporter
export function reportWebVitals(metric) {
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true
    });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}:`, metric.value);
  }
}
