// ============================================
// FILE: src/hooks/useInfiniteScroll.js
// Infinite Scroll Hook for Feeds and Lists
// VERSION: 1.0
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';

export default function useInfiniteScroll({
  fetchMore,
  hasMore = true,
  threshold = 200,
  rootMargin = '200px',
  enabled = true
}) {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !enabled) return;

    setIsLoading(true);
    try {
      await fetchMore();
    } finally {
      setIsLoading(false);
    }
  }, [fetchMore, isLoading, hasMore, enabled]);

  // Intersection Observer for automatic loading
  useEffect(() => {
    if (!enabled || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin,
        threshold: 0
      }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, isLoading, hasMore, enabled, rootMargin]);

  // Scroll-based fallback
  useEffect(() => {
    if (!enabled || !hasMore) return;

    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, isLoading, hasMore, enabled, threshold]);

  // Sentinel element ref to attach observer
  const sentinelRef = useCallback((node) => {
    if (loadMoreRef.current) {
      observerRef.current?.unobserve(loadMoreRef.current);
    }

    loadMoreRef.current = node;

    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  return {
    isLoading,
    loadMore,
    sentinelRef,
    hasMore
  };
}

// Hook for virtual scrolling (large lists)
export function useVirtualScroll({
  items = [],
  itemHeight = 100,
  containerHeight = 600,
  overscan = 5
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // Calculate visible range
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
    ...item,
    index: startIndex + index,
    style: {
      position: 'absolute',
      top: (startIndex + index) * itemHeight,
      height: itemHeight,
      width: '100%'
    }
  }));

  const offsetY = startIndex * itemHeight;

  return {
    containerRef,
    handleScroll,
    visibleItems,
    totalHeight,
    offsetY,
    containerProps: {
      ref: containerRef,
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }
    },
    innerProps: {
      style: {
        height: totalHeight,
        position: 'relative'
      }
    }
  };
}

// Hook for pull-to-refresh
export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  enabled = true
}) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const container = containerRef.current || document.body;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0 && window.scrollY === 0) {
        e.preventDefault();
        setPullDistance(Math.min(diff * 0.5, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, isPulling, isRefreshing, pullDistance, threshold, onRefresh]);

  return {
    containerRef,
    isPulling,
    pullDistance,
    isRefreshing,
    progress: Math.min(pullDistance / threshold, 1)
  };
}
