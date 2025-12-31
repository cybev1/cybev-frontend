// ============================================
// FILE: src/pages/settings/push-notifications.jsx
// PURPOSE: Push notification settings and preferences
// ============================================

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import {
  Bell,
  BellOff,
  BellRing,
  ArrowLeft,
  Check,
  X,
  Loader2,
  Smartphone,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Mail,
  DollarSign,
  Settings,
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const NOTIFICATION_TYPES = [
  { key: 'likes', label: 'Likes & Reactions', description: 'When someone likes or reacts to your content', icon: Heart, color: 'text-pink-400' },
  { key: 'comments', label: 'Comments', description: 'When someone comments on your posts', icon: MessageCircle, color: 'text-blue-400' },
  { key: 'follows', label: 'New Followers', description: 'When someone starts following you', icon: UserPlus, color: 'text-purple-400' },
  { key: 'mentions', label: 'Mentions', description: 'When someone mentions you in a post', icon: AtSign, color: 'text-yellow-400' },
  { key: 'messages', label: 'Direct Messages', description: 'When you receive a new message', icon: Mail, color: 'text-green-400' },
  { key: 'earnings', label: 'Earnings & Tips', description: 'When you receive tips or earnings', icon: DollarSign, color: 'text-emerald-400' },
  { key: 'system', label: 'System Updates', description: 'Important platform announcements', icon: Settings, color: 'text-gray-400' }
];

export default function PushNotificationsSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    preferences,
    requestPermission,
    unsubscribe,
    updatePreferences,
    sendTestNotification
  } = usePushNotifications();

  const [testSent, setTestSent] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await requestPermission();
    }
  };

  const handleTogglePreference = async (key) => {
    setSaving(true);
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    await updatePreferences(newPrefs);
    setSaving(false);
  };

  const handleTestNotification = async () => {
    const success = await sendTestNotification();
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Push Notifications - CYBEV</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/settings">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Settings
          </button>
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Bell className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Push Notifications</h1>
            <p className="text-gray-400">Manage your notification preferences</p>
          </div>
        </div>

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Not Supported</p>
              <p className="text-red-400/70 text-sm">Your browser doesn't support push notifications. Try using Chrome, Firefox, or Edge.</p>
            </div>
          </div>
        )}

        {/* Permission Blocked Warning */}
        {isSupported && permission === 'denied' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium">Notifications Blocked</p>
              <p className="text-yellow-400/70 text-sm">You've blocked notifications. To enable them, click the lock icon in your browser's address bar and allow notifications.</p>
            </div>
          </div>
        )}

        {/* Main Toggle */}
        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isSubscribed ? 'bg-green-500/20' : 'bg-gray-700'
              }`}>
                {isSubscribed ? (
                  <BellRing className="w-6 h-6 text-green-400" />
                ) : (
                  <BellOff className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold">Push Notifications</h3>
                <p className="text-gray-400 text-sm">
                  {isSubscribed ? 'You will receive notifications' : 'Enable to receive notifications'}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleNotifications}
              disabled={isLoading || !isSupported || permission === 'denied'}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isSubscribed ? 'bg-green-500' : 'bg-gray-600'
              } ${(isLoading || !isSupported || permission === 'denied') ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                isSubscribed ? 'left-7' : 'left-1'
              }`}>
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-gray-600 animate-spin absolute top-1 left-1" />
                )}
              </div>
            </button>
          </div>

          {/* Test Notification Button */}
          {isSubscribed && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={handleTestNotification}
                disabled={isLoading || testSent}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
              >
                {testSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Test notification sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send test notification</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <X className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Notification Type Preferences */}
        {isSubscribed && (
          <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Notification Types</h3>
              <p className="text-gray-400 text-sm">Choose what you want to be notified about</p>
            </div>

            <div className="divide-y divide-gray-700/50">
              {NOTIFICATION_TYPES.map((type) => (
                <div
                  key={type.key}
                  className="p-4 flex items-center justify-between hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center`}>
                      <type.icon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{type.label}</p>
                      <p className="text-gray-400 text-sm">{type.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePreference(type.key)}
                    disabled={saving}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      preferences[type.key] ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow ${
                      preferences[type.key] ? 'left-5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile App Promo */}
        <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Install CYBEV App</h3>
              <p className="text-gray-400 text-sm mb-3">
                Get instant notifications on your phone by installing CYBEV as an app.
              </p>
              <p className="text-purple-400 text-sm">
                Click the share button in your browser and select "Add to Home Screen"
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
