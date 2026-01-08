// ============================================
// FILE: src/hooks/useData.js
// Data Fetching Hooks with Caching & Revalidation
// VERSION: 1.0
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { LRUCache, debounce } from '../utils/performance';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Global cache for requests
const cache = new LRUCache(100);
const pendingRequests = new Map();

// Default fetcher
const defaultFetcher = async (url, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await axios({
    url: url.startsWith('http') ? url : `${API_URL}${url}`,
    method: options.method || 'GET',
    headers,
    data: options.body,
    ...options
  });

  return response.data;
};

// Main data fetching hook
export function useData(key, fetcher = defaultFetcher, options = {}) {
  const {
    initialData = null,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    refreshInterval = 0,
    dedupingInterval = 2000,
    errorRetryCount = 3,
    errorRetryInterval = 5000,
    onSuccess,
    onError,
    enabled = true
  } = options;

  const [data, setData] = useState(initialData || cache.get(key));
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!data && enabled);
  const [isValidating, setIsValidating] = useState(false);
  const retryCount = useRef(0);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (shouldSetLoading = true) => {
    if (!enabled || !key) return;

    // Check for pending request to dedupe
    if (pendingRequests.has(key)) {
      const pending = pendingRequests.get(key);
      if (Date.now() - pending.timestamp < dedupingInterval) {
        return pending.promise;
      }
    }

    if (shouldSetLoading && !data) setIsLoading(true);
    setIsValidating(true);

    const promise = fetcher(key)
      .then(result => {
        if (!mountedRef.current) return;
        setData(result);
        setError(null);
        cache.set(key, result);
        retryCount.current = 0;
        onSuccess?.(result);
        return result;
      })
      .catch(err => {
        if (!mountedRef.current) return;
        setError(err);
        onError?.(err);

        // Retry on error
        if (retryCount.current < errorRetryCount) {
          retryCount.current++;
          setTimeout(() => fetchData(false), errorRetryInterval);
        }

        throw err;
      })
      .finally(() => {
        if (!mountedRef.current) return;
        setIsLoading(false);
        setIsValidating(false);
        pendingRequests.delete(key);
      });

    pendingRequests.set(key, { promise, timestamp: Date.now() });
    return promise;
  }, [key, fetcher, enabled, data, dedupingInterval, errorRetryCount, errorRetryInterval, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true;
    if (enabled && !data) {
      fetchData();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [key, enabled]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus || typeof window === 'undefined') return;

    const onFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchData(false);
      }
    };

    document.addEventListener('visibilitychange', onFocus);
    return () => document.removeEventListener('visibilitychange', onFocus);
  }, [revalidateOnFocus, fetchData]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect || typeof window === 'undefined') return;

    const onOnline = () => fetchData(false);
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [revalidateOnReconnect, fetchData]);

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval || !enabled) return;

    const interval = setInterval(() => fetchData(false), refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, enabled, fetchData]);

  const mutate = useCallback((newData, shouldRevalidate = true) => {
    if (typeof newData === 'function') {
      setData(prev => {
        const updated = newData(prev);
        cache.set(key, updated);
        return updated;
      });
    } else if (newData !== undefined) {
      setData(newData);
      cache.set(key, newData);
    }
    
    if (shouldRevalidate) {
      fetchData(false);
    }
  }, [key, fetchData]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    revalidate: () => fetchData(false)
  };
}

// Infinite scroll / pagination hook
export function useInfiniteData(getKey, fetcher = defaultFetcher, options = {}) {
  const {
    initialData = [],
    pageSize = 20,
    revalidateFirstPage = true,
    onSuccess,
    onError
  } = options;

  const [pages, setPages] = useState([initialData]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const data = pages.flat();

  const loadPage = useCallback(async (pageIndex, isFirstPage = false) => {
    const key = getKey(pageIndex, pages[pageIndex - 1]);
    if (!key) {
      setHasMore(false);
      return;
    }

    if (isFirstPage) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await fetcher(key);
      const items = Array.isArray(result) ? result : (result.data || result.items || result.blogs || result.posts || []);
      
      setPages(prev => {
        const newPages = [...prev];
        newPages[pageIndex] = items;
        return newPages;
      });
      
      setHasMore(items.length >= pageSize);
      onSuccess?.(items);
      return items;
    } catch (err) {
      setError(err);
      onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [getKey, fetcher, pages, pageSize, onSuccess, onError]);

  // Load first page
  useEffect(() => {
    loadPage(0, true);
  }, []);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    loadPage(pages.length);
  }, [pages.length, isLoadingMore, hasMore, loadPage]);

  const refresh = useCallback(() => {
    setPages([]);
    setHasMore(true);
    return loadPage(0, true);
  }, [loadPage]);

  const mutate = useCallback((mutator) => {
    setPages(prev => {
      if (typeof mutator === 'function') {
        return mutator(prev);
      }
      return mutator;
    });
  }, []);

  return {
    data,
    pages,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    mutate,
    size: pages.length
  };
}

// Search hook with debouncing
export function useSearch(endpoint, options = {}) {
  const {
    debounceMs = 300,
    minLength = 2
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  const { data, isLoading, error } = useData(
    debouncedQuery.length >= minLength ? `${endpoint}?q=${encodeURIComponent(debouncedQuery)}` : null,
    defaultFetcher,
    { enabled: debouncedQuery.length >= minLength }
  );

  return {
    query,
    setQuery,
    results: data,
    isLoading: isLoading && debouncedQuery.length >= minLength,
    error
  };
}

// Mutation hook for POST/PUT/DELETE
export function useMutation(endpoint, options = {}) {
  const {
    method = 'POST',
    onSuccess,
    onError,
    invalidateKeys = []
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (body, mutateOptions = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await defaultFetcher(endpoint, {
        method: mutateOptions.method || method,
        body
      });

      setData(result);
      onSuccess?.(result);
      mutateOptions.onSuccess?.(result);

      // Invalidate cached keys
      invalidateKeys.forEach(key => cache.remove?.(key));

      return result;
    } catch (err) {
      setError(err);
      onError?.(err);
      mutateOptions.onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, method, onSuccess, onError, invalidateKeys]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    isLoading,
    error,
    data,
    reset
  };
}

export default useData;
