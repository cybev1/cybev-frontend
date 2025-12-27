// ============================================
// FILE: src/services/PushNotificationService.js
// Push Notification Service for Mobile
// ============================================

// Check if running in Capacitor
const isCapacitor = typeof window !== 'undefined' && window.Capacitor;

let PushNotifications = null;
let LocalNotifications = null;

// Dynamically import Capacitor plugins
if (isCapacitor) {
  try {
    const capacitor = require('@capacitor/push-notifications');
    PushNotifications = capacitor.PushNotifications;
  } catch (e) {
    console.log('Push notifications plugin not available');
  }
  
  try {
    const local = require('@capacitor/local-notifications');
    LocalNotifications = local.LocalNotifications;
  } catch (e) {
    console.log('Local notifications plugin not available');
  }
}

class PushNotificationService {
  constructor() {
    this.token = null;
    this.listeners = [];
    this.initialized = false;
  }

  // Initialize push notifications
  async initialize() {
    if (this.initialized || !PushNotifications) {
      return false;
    }

    try {
      // Request permission
      const permStatus = await PushNotifications.requestPermissions();
      
      if (permStatus.receive === 'granted') {
        // Register with FCM/APNs
        await PushNotifications.register();
        
        // Listen for registration success
        PushNotifications.addListener('registration', (token) => {
          console.log('Push registration success:', token.value);
          this.token = token.value;
          this.saveTokenToServer(token.value);
        });

        // Listen for registration errors
        PushNotifications.addListener('registrationError', (error) => {
          console.error('Push registration error:', error);
        });

        // Listen for push notifications received
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received:', notification);
          this.handleNotificationReceived(notification);
        });

        // Listen for push notification action (tapped)
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Push notification action:', action);
          this.handleNotificationAction(action);
        });

        this.initialized = true;
        return true;
      } else {
        console.log('Push notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Push initialization error:', error);
      return false;
    }
  }

  // Save FCM token to server
  async saveTokenToServer(fcmToken) {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) return;

      const response = await fetch('/api/push/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          token: fcmToken,
          platform: this.getPlatform()
        })
      });

      if (response.ok) {
        console.log('FCM token saved to server');
        localStorage.setItem('fcm_token', fcmToken);
      }
    } catch (error) {
      console.error('Failed to save FCM token:', error);
    }
  }

  // Get platform type
  getPlatform() {
    if (typeof window !== 'undefined' && window.Capacitor) {
      return window.Capacitor.getPlatform(); // 'ios' or 'android'
    }
    return 'web';
  }

  // Handle notification received while app is open
  handleNotificationReceived(notification) {
    // Show local notification if app is in foreground
    if (LocalNotifications) {
      LocalNotifications.schedule({
        notifications: [{
          title: notification.title || 'CYBEV',
          body: notification.body || '',
          id: Date.now(),
          schedule: { at: new Date(Date.now()) },
          extra: notification.data
        }]
      });
    }

    // Notify listeners
    this.listeners.forEach(listener => {
      listener('received', notification);
    });
  }

  // Handle notification tapped
  handleNotificationAction(action) {
    const data = action.notification?.data;
    
    // Navigate based on notification type
    if (data?.type === 'blog' && data?.blogId) {
      window.location.href = `/blog/${data.blogId}`;
    } else if (data?.type === 'follow' && data?.userId) {
      window.location.href = `/profile/${data.userId}`;
    } else if (data?.type === 'comment' && data?.blogId) {
      window.location.href = `/blog/${data.blogId}#comments`;
    } else if (data?.type === 'reward') {
      window.location.href = '/rewards/dashboard';
    } else {
      window.location.href = '/notifications';
    }

    // Notify listeners
    this.listeners.forEach(listener => {
      listener('action', action);
    });
  }

  // Add notification listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Get current FCM token
  getToken() {
    return this.token || localStorage.getItem('fcm_token');
  }

  // Request permission (can be called again if denied)
  async requestPermission() {
    if (!PushNotifications) {
      // Fall back to web push if available
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }

    const result = await PushNotifications.requestPermissions();
    return result.receive === 'granted';
  }

  // Check if notifications are enabled
  async checkPermission() {
    if (!PushNotifications) {
      if ('Notification' in window) {
        return Notification.permission === 'granted';
      }
      return false;
    }

    const result = await PushNotifications.checkPermissions();
    return result.receive === 'granted';
  }

  // Unregister from push notifications
  async unregister() {
    try {
      const fcmToken = this.getToken();
      if (fcmToken) {
        const authToken = localStorage.getItem('token');
        if (authToken) {
          await fetch('/api/push/unregister', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ token: fcmToken })
          });
        }
      }

      if (PushNotifications) {
        await PushNotifications.removeAllListeners();
      }

      localStorage.removeItem('fcm_token');
      this.token = null;
      this.initialized = false;
    } catch (error) {
      console.error('Unregister error:', error);
    }
  }

  // Schedule a local notification
  async scheduleLocalNotification(title, body, data = {}, delaySeconds = 0) {
    if (!LocalNotifications) {
      // Fall back to web notification
      if ('Notification' in window && Notification.permission === 'granted') {
        setTimeout(() => {
          new Notification(title, { body, data });
        }, delaySeconds * 1000);
      }
      return;
    }

    await LocalNotifications.schedule({
      notifications: [{
        title,
        body,
        id: Date.now(),
        schedule: { at: new Date(Date.now() + delaySeconds * 1000) },
        extra: data
      }]
    });
  }

  // Clear all notifications
  async clearAllNotifications() {
    if (PushNotifications) {
      await PushNotifications.removeAllDeliveredNotifications();
    }
    if (LocalNotifications) {
      await LocalNotifications.cancel({ notifications: [] });
    }
  }
}

// Export singleton instance
const pushService = new PushNotificationService();
export default pushService;

// Also export class for testing
export { PushNotificationService };
