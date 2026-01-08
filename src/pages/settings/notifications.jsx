// ============================================
// FILE: src/pages/settings/notifications.jsx
// Consolidated Notification Settings
// VERSION: 2.0
// Merges: notifications.jsx, notification-preferences.jsx, push-notifications.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Heart,
  UserPlus,
  Radio,
  Calendar,
  DollarSign,
  Shield,
  Moon,
  Clock,
  Save,
  Loader2,
  ChevronRight,
  AlertCircle,
  Check,
  Volume2,
  VolumeX
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Notification categories
const NOTIFICATION_CATEGORIES = [
  {
    id: 'social',
    label: 'Social',
    icon: Heart,
    color: 'text-pink-500',
    settings: [
      { key: 'likes', label: 'Likes on your posts', default: true },
      { key: 'comments', label: 'Comments on your posts', default: true },
      { key: 'mentions', label: 'Mentions and tags', default: true },
      { key: 'shares', label: 'Shares of your content', default: true },
      { key: 'replies', label: 'Replies to your comments', default: true }
    ]
  },
  {
    id: 'follows',
    label: 'Followers',
    icon: UserPlus,
    color: 'text-blue-500',
    settings: [
      { key: 'newFollower', label: 'New followers', default: true },
      { key: 'followRequest', label: 'Follow requests', default: true },
      { key: 'followAccepted', label: 'Accepted follow requests', default: false }
    ]
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    color: 'text-green-500',
    settings: [
      { key: 'directMessage', label: 'Direct messages', default: true },
      { key: 'groupMessage', label: 'Group chat messages', default: true },
      { key: 'messageRequest', label: 'Message requests', default: true }
    ]
  },
  {
    id: 'live',
    label: 'Live & Events',
    icon: Radio,
    color: 'text-red-500',
    settings: [
      { key: 'liveStart', label: 'When someone you follow goes live', default: true },
      { key: 'scheduledStream', label: 'Upcoming scheduled streams', default: true },
      { key: 'eventReminder', label: 'Event reminders', default: true },
      { key: 'eventInvite', label: 'Event invitations', default: true }
    ]
  },
  {
    id: 'monetization',
    label: 'Earnings & Tips',
    icon: DollarSign,
    color: 'text-yellow-500',
    settings: [
      { key: 'tipReceived', label: 'Tips received', default: true },
      { key: 'newSubscriber', label: 'New subscribers', default: true },
      { key: 'payoutReady', label: 'Payout ready', default: true },
      { key: 'earningsUpdate', label: 'Weekly earnings summary', default: true }
    ]
  },
  {
    id: 'system',
    label: 'System',
    icon: Shield,
    color: 'text-purple-500',
    settings: [
      { key: 'securityAlert', label: 'Security alerts', default: true },
      { key: 'loginAlert', label: 'New device login', default: true },
      { key: 'accountUpdate', label: 'Account updates', default: true },
      { key: 'newsletter', label: 'Product updates & news', default: false }
    ]
  }
];

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Delivery channels
    channels: {
      push: true,
      email: true,
      inApp: true
    },
    // Category settings
    categories: {},
    // Quiet hours
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    // Digest preferences
    digest: {
      enabled: false,
      frequency: 'daily', // daily, weekly
      time: '09:00'
    },
    // Sound
    sound: true
  });

  useEffect(() => {
    fetchSettings();
    checkPushSupport();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const res = await axios.get(`${API_URL}/api/notifications/preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.ok && res.data.preferences) {
        setSettings(prev => ({
          ...prev,
          ...res.data.preferences
        }));
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPushSupport = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupported(true);
      
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setPushEnabled(!!subscription);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/notifications/preferences`,
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Show success toast
      alert('Settings saved!');
    } catch (error) {
      console.error('Save settings error:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (categoryId, settingKey) => {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: {
          ...prev.categories[categoryId],
          [settingKey]: !prev.categories[categoryId]?.[settingKey]
        }
      }
    }));
  };

  const toggleChannel = (channel) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel]
      }
    }));
  };

  const enablePush = async () => {
    if (!pushSupported) return;
    
    setPushLoading(true);
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        
        // Get VAPID public key from server
        const keyRes = await axios.get(`${API_URL}/api/push/vapid-key`);
        const vapidKey = keyRes.data.publicKey;
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });

        // Send subscription to server
        const token = localStorage.getItem('token');
        await axios.post(
          `${API_URL}/api/push/subscribe`,
          { subscription },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPushEnabled(true);
        setSettings(prev => ({
          ...prev,
          channels: { ...prev.channels, push: true }
        }));
      }
    } catch (error) {
      console.error('Enable push error:', error);
      alert('Failed to enable push notifications');
    } finally {
      setPushLoading(false);
    }
  };

  const disablePush = async () => {
    setPushLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        const token = localStorage.getItem('token');
        await axios.post(
          `${API_URL}/api/push/unsubscribe`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setPushEnabled(false);
      setSettings(prev => ({
        ...prev,
        channels: { ...prev.channels, push: false }
      }));
    } catch (error) {
      console.error('Disable push error:', error);
    } finally {
      setPushLoading(false);
    }
  };

  // Convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Notification Settings | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="text-gray-600 dark:text-gray-400">
                  ←
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h1>
              </div>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mt-4">
              {['preferences', 'channels', 'schedule'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    activeTab === tab
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {NOTIFICATION_CATEGORIES.map(category => (
                <div 
                  key={category.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 border-b dark:border-gray-700 flex items-center gap-3">
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {category.label}
                    </h3>
                  </div>
                  <div className="divide-y dark:divide-gray-700">
                    {category.settings.map(setting => (
                      <div 
                        key={setting.key}
                        className="p-4 flex items-center justify-between"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {setting.label}
                        </span>
                        <button
                          onClick={() => toggleCategory(category.id, setting.key)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.categories[category.id]?.[setting.key] ?? setting.default
                              ? 'bg-purple-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            settings.categories[category.id]?.[setting.key] ?? setting.default
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Channels Tab */}
          {activeTab === 'channels' && (
            <div className="space-y-4">
              {/* Push Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Push Notifications
                      </h3>
                      <p className="text-sm text-gray-500">
                        Get instant alerts on your device
                      </p>
                    </div>
                  </div>
                  {pushSupported ? (
                    <button
                      onClick={pushEnabled ? disablePush : enablePush}
                      disabled={pushLoading}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pushEnabled
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      {pushLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : pushEnabled ? (
                        <>
                          <Check className="w-4 h-4 inline mr-1" />
                          Enabled
                        </>
                      ) : (
                        'Enable'
                      )}
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">Not supported</span>
                  )}
                </div>
              </div>

              {/* Email Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleChannel('email')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.channels.email ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.channels.email ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        In-App Notifications
                      </h3>
                      <p className="text-sm text-gray-500">
                        See notifications inside the app
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleChannel('inApp')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.channels.inApp ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.channels.inApp ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Sound */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      {settings.sound ? (
                        <Volume2 className="w-5 h-5 text-orange-600" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Notification Sounds
                      </h3>
                      <p className="text-sm text-gray-500">
                        Play sound for notifications
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, sound: !prev.sound }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.sound ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.sound ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              {/* Quiet Hours */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Quiet Hours
                      </h3>
                      <p className="text-sm text-gray-500">
                        Pause notifications during set times
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled }
                    }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.quietHours.enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.quietHours.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, start: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, end: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Email Digest */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Email Digest
                      </h3>
                      <p className="text-sm text-gray-500">
                        Get a summary instead of individual emails
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      digest: { ...prev.digest, enabled: !prev.digest.enabled }
                    }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.digest.enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.digest.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {settings.digest.enabled && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Frequency
                      </label>
                      <select
                        value={settings.digest.frequency}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          digest: { ...prev.digest, frequency: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Delivery Time
                      </label>
                      <input
                        type="time"
                        value={settings.digest.time}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          digest: { ...prev.digest, time: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
