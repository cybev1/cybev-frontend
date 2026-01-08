// ============================================
// FILE: src/pages/settings/notification-preferences.jsx
// Notification Preferences Settings
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  Bell,
  Mail,
  Smartphone,
  Moon,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Heart,
  MessageSquare,
  UserPlus,
  AtSign,
  Send,
  Megaphone,
  Gift,
  Video,
  CalendarDays,
  Users,
  Loader2,
  Save,
  ArrowLeft,
  Check,
  Pause,
  Play
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const NOTIFICATION_TYPES = [
  { key: 'like', label: 'Likes', description: 'When someone likes your content', icon: Heart },
  { key: 'comment', label: 'Comments', description: 'When someone comments on your content', icon: MessageSquare },
  { key: 'follow', label: 'New Followers', description: 'When someone follows you', icon: UserPlus },
  { key: 'mention', label: 'Mentions', description: 'When someone mentions you', icon: AtSign },
  { key: 'message', label: 'Messages', description: 'When you receive a direct message', icon: Send },
  { key: 'announcement', label: 'Announcements', description: 'Platform announcements and updates', icon: Megaphone },
  { key: 'reward', label: 'Rewards', description: 'Token rewards and achievements', icon: Gift },
  { key: 'stream', label: 'Live Streams', description: 'When someone you follow goes live', icon: Video },
  { key: 'event', label: 'Events', description: 'Event reminders and updates', icon: CalendarDays },
  { key: 'group', label: 'Groups', description: 'Group activity and mentions', icon: Users }
];

const FREQUENCY_OPTIONS = [
  { value: 'instant', label: 'Instant', description: 'Get notified immediately' },
  { value: 'hourly', label: 'Hourly Digest', description: 'Bundled every hour' },
  { value: 'daily', label: 'Daily Digest', description: 'Once per day summary' },
  { value: 'weekly', label: 'Weekly Digest', description: 'Once per week summary' }
];

export default function NotificationPreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState({
    // Types
    like: true,
    comment: true,
    follow: true,
    mention: true,
    message: true,
    announcement: true,
    reward: true,
    stream: true,
    event: true,
    group: true,
    // Delivery
    frequency: 'instant',
    emailEnabled: true,
    pushEnabled: true,
    // Quiet hours
    quietHoursEnabled: false,
    quietHoursStart: 22,
    quietHoursEnd: 8,
    // Digest
    digestTime: '09:00',
    digestDay: 1,
    // Grouping
    groupSimilar: true,
    // Paused
    paused: false
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const res = await axios.get(`${API_URL}/api/notifications/preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPreferences(prev => ({ ...prev, ...res.data.preferences }));
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      await axios.put(
        `${API_URL}/api/notifications/preferences`,
        preferences,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const togglePause = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = preferences.paused ? 'resume' : 'pause';
      
      await axios.post(
        `${API_URL}/api/notifications/${endpoint}`,
        preferences.paused ? {} : { duration: 24 }, // Pause for 24 hours
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPreferences(prev => ({ ...prev, paused: !prev.paused }));
    } catch (error) {
      console.error('Toggle pause error:', error);
    }
  };

  const updatePref = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
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
        <title>Notification Preferences | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <h1 className="font-semibold text-gray-900 dark:text-white">Notifications</h1>
              </div>
            </div>
            <button
              onClick={savePreferences}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Pause All */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {preferences.paused ? (
                  <VolumeX className="w-5 h-5 text-orange-500" />
                ) : (
                  <Volume2 className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {preferences.paused ? 'Notifications Paused' : 'Notifications Active'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {preferences.paused 
                      ? 'You won\'t receive any notifications'
                      : 'You\'re receiving notifications normally'}
                  </div>
                </div>
              </div>
              <button
                onClick={togglePause}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  preferences.paused
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}
              >
                {preferences.paused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Delivery Method</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
                    <div className="text-sm text-gray-500">Receive push notifications on your devices</div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.pushEnabled}
                    onChange={(e) => updatePref('pushEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-checked:bg-purple-600 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications via email</div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailEnabled}
                    onChange={(e) => updatePref('emailEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-checked:bg-purple-600 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Notification Frequency</h2>
              <p className="text-sm text-gray-500 mt-1">Choose how often you want to be notified</p>
            </div>
            <div className="p-4 space-y-2">
              {FREQUENCY_OPTIONS.map(option => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                    preferences.frequency === option.value
                      ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={preferences.frequency === option.value}
                    onChange={(e) => updatePref('frequency', e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Digest Time (only show for non-instant) */}
            {preferences.frequency !== 'instant' && (
              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Delivery Time
                    </label>
                    <input
                      type="time"
                      value={preferences.digestTime}
                      onChange={(e) => updatePref('digestTime', e.target.value)}
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  {preferences.frequency === 'weekly' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Day of Week
                      </label>
                      <select
                        value={preferences.digestDay}
                        onChange={(e) => updatePref('digestDay', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value={0}>Sunday</option>
                        <option value={1}>Monday</option>
                        <option value={2}>Tuesday</option>
                        <option value={3}>Wednesday</option>
                        <option value={4}>Thursday</option>
                        <option value={5}>Friday</option>
                        <option value={6}>Saturday</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quiet Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Quiet Hours</h2>
                    <p className="text-sm text-gray-500">Don't disturb me during these hours</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.quietHoursEnabled}
                    onChange={(e) => updatePref('quietHoursEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-checked:bg-purple-600 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
            </div>
            
            {preferences.quietHoursEnabled && (
              <div className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start
                  </label>
                  <select
                    value={preferences.quietHoursStart}
                    onChange={(e) => updatePref('quietHoursStart', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-6 text-gray-400">to</div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End
                  </label>
                  <select
                    value={preferences.quietHoursEnd}
                    onChange={(e) => updatePref('quietHoursEnd', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Notification Types */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Notification Types</h2>
              <p className="text-sm text-gray-500 mt-1">Choose which notifications you want to receive</p>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {NOTIFICATION_TYPES.map(type => (
                <div key={type.key} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <type.icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[type.key]}
                      onChange={(e) => updatePref(type.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-checked:bg-purple-600 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Group Similar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Group Similar Notifications</div>
                <div className="text-sm text-gray-500">
                  Combine multiple similar notifications (e.g., "5 people liked your post")
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.groupSimilar}
                  onChange={(e) => updatePref('groupSimilar', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-checked:bg-purple-600 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
