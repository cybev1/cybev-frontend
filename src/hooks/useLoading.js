// ============================================
// FILE: src/hooks/useLoading.js
// Loading State Hook with Skeleton Support
// VERSION: 1.0
// ============================================

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing loading states with minimum display time
 * Prevents skeleton flash for fast loads
 * 
 * @param {boolean} initialState - Initial loading state
 * @param {number} minDisplayTime - Minimum time to show loading (ms)
 * @returns {Object} - Loading state and control functions
 */
export function useLoading(initialState = false, minDisplayTime = 300) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [showSkeleton, setShowSkeleton] = useState(initialState);
  const [loadingStartTime, setLoadingStartTime] = useState(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setShowSkeleton(true);
    setLoadingStartTime(Date.now());
  }, []);

  const stopLoading = useCallback(() => {
    const elapsed = Date.now() - (loadingStartTime || Date.now());
    const remaining = Math.max(0, minDisplayTime - elapsed);

    setIsLoading(false);

    // Ensure skeleton shows for minimum time to prevent flash
    if (remaining > 0) {
      setTimeout(() => {
        setShowSkeleton(false);
      }, remaining);
    } else {
      setShowSkeleton(false);
    }
  }, [loadingStartTime, minDisplayTime]);

  return {
    isLoading,
    showSkeleton,
    startLoading,
    stopLoading,
    setLoading: setIsLoading
  };
}

/**
 * Hook for fetch operations with loading state
 * 
 * @param {Function} fetchFn - Async function to execute
 * @param {Object} options - Options
 * @returns {Object} - Data, loading state, error, and refetch function
 */
export function useFetch(fetchFn, options = {}) {
  const { 
    autoFetch = true, 
    dependencies = [],
    onSuccess,
    onError,
    minLoadTime = 300
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { isLoading, showSkeleton, startLoading, stopLoading } = useLoading(autoFetch, minLoadTime);

  const execute = useCallback(async (...args) => {
    try {
      startLoading();
      setError(null);
      
      const result = await fetchFn(...args);
      setData(result);
      
      if (onSuccess) onSuccess(result);
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      
      if (onError) onError(err);
      
      throw err;
    } finally {
      stopLoading();
    }
  }, [fetchFn, startLoading, stopLoading, onSuccess, onError]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, ...dependencies]);

  return {
    data,
    error,
    isLoading,
    showSkeleton,
    refetch: execute,
    setData
  };
}

/**
 * Hook for paginated/infinite scroll loading
 * 
 * @param {Function} fetchFn - Async function that takes page number
 * @param {Object} options - Options
 * @returns {Object} - Items, loading states, and control functions
 */
export function useInfiniteLoad(fetchFn, options = {}) {
  const {
    pageSize = 10,
    initialPage = 1,
    getNextPageParam,
    onSuccess,
    onError
  } = options;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = useCallback(async (pageNum, append = true) => {
    try {
      if (pageNum === initialPage) {
        setIsLoadingInitial(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const result = await fetchFn(pageNum, pageSize);
      const newItems = Array.isArray(result) ? result : result.items || result.data || [];
      
      // Determine if there are more items
      const moreAvailable = getNextPageParam 
        ? getNextPageParam(result) !== undefined 
        : newItems.length >= pageSize;
      
      setHasMore(moreAvailable);
      
      if (append && pageNum > initialPage) {
        setItems(prev => [...prev, ...newItems]);
      } else {
        setItems(newItems);
      }

      setPage(pageNum);
      
      if (onSuccess) onSuccess(result);
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to load');
      if (onError) onError(err);
      throw err;
    } finally {
      setIsLoadingInitial(false);
      setIsLoadingMore(false);
    }
  }, [fetchFn, pageSize, initialPage, getNextPageParam, onSuccess, onError]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      return loadPage(page + 1);
    }
  }, [loadPage, page, isLoadingMore, hasMore]);

  const refresh = useCallback(() => {
    setPage(initialPage);
    return loadPage(initialPage, false);
  }, [loadPage, initialPage]);

  // Initial load
  useEffect(() => {
    loadPage(initialPage, false);
  }, []);

  return {
    items,
    isLoading: isLoadingInitial,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    setItems
  };
}

/**
 * Hook for tracking multiple loading states
 * Useful for forms with multiple async operations
 */
export function useMultipleLoading() {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = useCallback((key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const isLoading = useCallback((key) => loadingStates[key] || false, [loadingStates]);

  const withLoading = useCallback((key, asyncFn) => {
    return async (...args) => {
      setLoading(key, true);
      try {
        return await asyncFn(...args);
      } finally {
        setLoading(key, false);
      }
    };
  }, [setLoading]);

  return {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
    withLoading
  };
}

export default useLoading;
