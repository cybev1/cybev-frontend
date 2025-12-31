// ============================================
// FILE: src/hooks/usePushNotifications.js
// PURPOSE: Push notification management hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

// Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    earnings: true,
    system: true
  });

  // Check if push notifications are supported
  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 
                      'PushManager' in window && 
                      'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
      checkExistingSubscription();
      loadPreferences();
    }
  }, []);

  // Check for existing subscription
  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();
      setSubscription(existingSub);
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  };

  // Load notification preferences from server
  const loadPreferences = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (!token) return;

      const response = await api.get('/api/user/notification-preferences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.preferences) {
        setPreferences(response.data.preferences);
      }
    } catch (err) {
      // Use defaults if not found
    }
  };

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        await subscribe();
        return true;
      } else {
        setError(result === 'denied' 
          ? 'Notifications blocked. Please enable in browser settings.' 
          : 'Notification permission not granted');
        return false;
      }
    } catch (err) {
      setError('Failed to request permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Get VAPID public key from environment
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        throw new Error('VAPID public key not configured');
      }

      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      setSubscription(newSubscription);

      // Send subscription to server
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post('/api/push/subscribe', {
        subscription: newSubscription.toJSON()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return true;
    } catch (err) {
      console.error('Subscribe error:', err);
      setError('Failed to subscribe to notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!subscription) return true;

    setIsLoading(true);
    setError(null);

    try {
      await subscription.unsubscribe();
      setSubscription(null);

      // Notify server
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post('/api/push/unsubscribe', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return true;
    } catch (err) {
      setError('Failed to unsubscribe');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  // Update notification preferences
  const updatePreferences = useCallback(async (newPreferences) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.put('/api/user/notification-preferences', {
        preferences: newPreferences
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPreferences(newPreferences);
      return true;
    } catch (err) {
      setError('Failed to update preferences');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (!subscription) {
      setError('Not subscribed to notifications');
      return false;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post('/api/push/test', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (err) {
      setError('Failed to send test notification');
      return false;
    }
  }, [subscription]);

  return {
    isSupported,
    permission,
    subscription,
    isSubscribed: !!subscription,
    isLoading,
    error,
    preferences,
    requestPermission,
    subscribe,
    unsubscribe,
    updatePreferences,
    sendTestNotification
  };
}

export default usePushNotifications;
