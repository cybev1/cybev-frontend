// ============================================
// FILE: src/hooks/usePushNotifications.js
// Push Notifications Hook
// ============================================
import { useState, useEffect, useCallback } from 'react';
import pushService from '@/services/PushNotificationService';

export function usePushNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const hasPermission = await pushService.checkPermission();
      setEnabled(hasPermission);
      setToken(pushService.getToken());
    } catch (error) {
      console.error('Check push status error:', error);
    } finally {
      setLoading(false);
    }
  };

  const enable = useCallback(async () => {
    setLoading(true);
    try {
      const success = await pushService.initialize();
      setEnabled(success);
      if (success) {
        setToken(pushService.getToken());
      }
      return success;
    } catch (error) {
      console.error('Enable push error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setLoading(true);
    try {
      await pushService.unregister();
      setEnabled(false);
      setToken(null);
    } catch (error) {
      console.error('Disable push error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleLocal = useCallback(async (title, body, data, delaySeconds) => {
    return pushService.scheduleLocalNotification(title, body, data, delaySeconds);
  }, []);

  const clearAll = useCallback(async () => {
    return pushService.clearAllNotifications();
  }, []);

  const addListener = useCallback((callback) => {
    return pushService.addListener(callback);
  }, []);

  return {
    enabled,
    loading,
    token,
    enable,
    disable,
    scheduleLocal,
    clearAll,
    addListener,
    refresh: checkStatus
  };
}

export default usePushNotifications;
