// ============================================
// FILE: src/hooks/useOffline.js
// Offline Status Hook
// ============================================
import { useState, useEffect, useCallback } from 'react';
import offlineService from '@/services/OfflineService';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(offlineService.checkOnline());
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Subscribe to online/offline changes
    const unsubscribe = offlineService.addListener((status) => {
      setIsOnline(status === 'online');
      
      // Update pending count
      const stats = offlineService.getCacheStats();
      setPendingCount(stats.pendingActions);
    });

    return unsubscribe;
  }, []);

  const cacheData = useCallback((key, data, expiry) => {
    return offlineService.cacheData(key, data, expiry);
  }, []);

  const getCachedData = useCallback((key) => {
    return offlineService.getCachedData(key);
  }, []);

  const fetchWithCache = useCallback((url, options, cacheKey) => {
    return offlineService.fetchWithCache(url, options, cacheKey);
  }, []);

  const queueAction = useCallback((action) => {
    const id = offlineService.queueAction(action);
    const stats = offlineService.getCacheStats();
    setPendingCount(stats.pendingActions);
    return id;
  }, []);

  const getCacheStats = useCallback(() => {
    return offlineService.getCacheStats();
  }, []);

  const clearCache = useCallback(() => {
    offlineService.clearAllCache();
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    pendingCount,
    cacheData,
    getCachedData,
    fetchWithCache,
    queueAction,
    getCacheStats,
    clearCache
  };
}

export default useOffline;