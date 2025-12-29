// ============================================
// FILE: src/pages/settings/notifications.jsx
// PATH: cybev-frontend/src/pages/settings/notifications.jsx
// PURPOSE: Push notification settings and preferences
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Bell,
  BellOff,
  Smartphone,
  Monitor,
  Mail,
  MessageCircle,
  Heart,
  UserPlus,
  AtSign,
  DollarSign,
  Sparkles,
  Coins,
  Radio,
  Moon,
  Sun,
  Trash2,
  ChevronLeft,
  Check,
  X,
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react';
import api from '@/lib/api';

// Toggle Switch Component
function Toggle({ enabled, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        enabled ? 'bg-purple-500' : 'bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-0.5'
      }`} />
    </button>
  );
}

// Setting Row Component
function SettingRow({ icon: Icon, title, description, enabled, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-700/50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <p className="text-white font-medium">{title}</p>
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
      </div>
      <Toggle enabled={enabled} onChange={onChange} disabled={disabled} />
    </div>
  );
}

// Device Card Component
function DeviceCard({ device, onRemove }) {
  const getDeviceIcon = () => {
    if (device.device?.type === 'mobile') return Smartphone;
    return Monitor;
  };
  
  const Icon = getDeviceIcon();
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <p className="text-white font-medium">
            {device.device?.browser || 'Unknown Browser'} on {device.device?.os || 'Unknown OS'}
          </p>
          <p className="text-gray-400 text-sm">
            Last used: {new Date(device.lastUsed).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button
        onClick={() => onRemove(device)}
        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function NotificationSettings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState('default');
  const [devices, setDevices] = useState([]);
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    push: {
      enabled: true,
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
      messages: true,
      tips: true,
      nftSales: true,
      stakingRewards: true,
      liveStreams: true,
      marketing: false
    },
    email: {
      enabled: true,
      digest: 'daily',
      marketing: false
    },
    quiet: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch (e) {}
    }

    // Check push notification support
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPushSupported(true);
      setPushPermission(Notification.permission);
    }

    fetchPreferences();
    fetchDevices();
  }, [router]);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/push/preferences', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.log('Using default preferences');
    } finally {
      setLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/push/subscriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setDevices(response.data.subscriptions);
      }
    } catch (error) {
      console.log('No devices found');
    }
  };

  const savePreferences = async (newPrefs) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.put('/api/push/preferences', newPrefs, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreferences(newPrefs);
    } catch (error) {
      console.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const updatePushSetting = (key, value) => {
    const newPrefs = {
      ...preferences,
      push: { ...preferences.push, [key]: value }
    };
    savePreferences(newPrefs);
  };

  const updateEmailSetting = (key, value) => {
    const newPrefs = {
      ...preferences,
      email: { ...preferences.email, [key]: value }
    };
    savePreferences(newPrefs);
  };

  const updateQuietSetting = (key, value) => {
    const newPrefs = {
      ...preferences,
      quiet: { ...preferences.quiet, [key]: value }
    };
    savePreferences(newPrefs);
  };

  const requestPushPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission === 'granted') {
        // Register service worker and subscribe
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        });

        // Send subscription to server
        const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
        await api.post('/api/push/subscribe', {
          subscription: subscription.toJSON(),
          device: {
            type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            browser: navigator.userAgent.split(' ').pop()?.split('/')[0] || 'Unknown',
            os: navigator.platform
          }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        fetchDevices();
        alert('Push notifications enabled!');
      }
    } catch (error) {
      console.error('Push permission error:', error);
      alert('Failed to enable push notifications');
    }
  };

  const removeDevice = async (device) => {
    if (!confirm('Remove this device?')) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post('/api/push/unsubscribe', {
        endpoint: device.endpoint
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDevices(devices.filter(d => d._id !== device._id));
    } catch (error) {
      alert('Failed to remove device');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Notification Settings - CYBEV</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/settings">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Notification Settings</h1>
            <p className="text-gray-400">Manage how you receive notifications</p>
          </div>
        </div>

        {/* Push Notification Status */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Push Notifications</h2>
                <p className="text-gray-400 text-sm">
                  {!pushSupported ? 'Not supported in this browser' :
                   pushPermission === 'granted' ? 'Enabled on this device' :
                   pushPermission === 'denied' ? 'Blocked by browser' :
                   'Not enabled yet'}
                </p>
              </div>
            </div>

            {pushSupported && pushPermission !== 'granted' && pushPermission !== 'denied' && (
              <button
                onClick={requestPushPermission}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Enable
              </button>
            )}

            {pushPermission === 'denied' && (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Blocked</span>
              </div>
            )}
          </div>

          {pushPermission === 'denied' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-yellow-400 text-sm flex items-start gap-2">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                Push notifications are blocked. To enable them, click the lock icon in your browser's address bar and allow notifications.
              </p>
            </div>
          )}
        </div>

        {/* Registered Devices */}
        {devices.length > 0 && (
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 mb-6">
            <h3 className="text-white font-bold mb-4">Registered Devices</h3>
            <div className="space-y-3">
              {devices.map((device) => (
                <DeviceCard key={device._id} device={device} onRemove={removeDevice} />
              ))}
            </div>
          </div>
        )}

        {/* Push Notification Types */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Push Notifications</h3>
            <Toggle
              enabled={preferences.push.enabled}
              onChange={(v) => updatePushSetting('enabled', v)}
            />
          </div>

          <div className={preferences.push.enabled ? '' : 'opacity-50 pointer-events-none'}>
            <SettingRow
              icon={Heart}
              title="Likes"
              description="When someone likes your content"
              enabled={preferences.push.likes}
              onChange={(v) => updatePushSetting('likes', v)}
              disabled={!preferences.push.enabled}
            />
            <SettingRow
              icon={MessageCircle}
              title="Comments"
              description="When someone comments on your posts"
              enabled={preferences.push.comments}
              onChange={(v) => updatePushSetting('comments', v)}
              disabled={!preferences.push.enabled}
            />
            <SettingRow
              icon={UserPlus}
              title="New Followers"
              description="When someone follows you"
              enabled={preferences.push.follows}
              onChange={(v) => updatePushSetting('follows', v)}
              disabled={!preferences.push.enabled}
            />
            <SettingRow
              icon={AtSign}
              title="Mentions"
              description="When someone mentions you"
              enabled={preferences.push.mentions}
              onChange={(v) => updatePushSetting('mentions', v)}
              disabled={!preferences.push.enabled}
            />
            <SettingRow
              icon={Mail}
              title="Direct Messages"
              description="When you receive a new message"
              enabled={preferences.push.messages}
              onChange={(v) => updatePushSetting('messages', v)}
              disabled={!preferences.push.enabled}
            />
            <SettingRow
              icon={DollarSign}
              title="Tips & Donations"
              description="When you receive a tip"
              enabled={preferences.push.tips}
              onChange={(v) => updatePushSetting('tips', v)}
              disabled={!preferences.push.enabled}
            />
            <SettingRow
              icon={Sparkles}
              title="NFT Sales"
              description="When your NFT is sold"
              enabled={preferences.push.nftSales}
              onChange={(v) => updatePushSetting('nftSales', v)}
              disabled={!preferences.push.enabled}
            />
            <SettingRow
              icon={Coins}
              title="Staking Rewards"
              description="When you earn staking rewards"
              enabled={preferences.push.stakingRewards}
              onChange={(v) => updatePushSetting('stakingRewards', v)}
              disabled={!preferences.push.enabled}
            />
            <SettingRow
              icon={Radio}
              title="Live Streams"
              description="When someone you follow goes live"
              enabled={preferences.push.liveStreams}
              onChange={(v) => updatePushSetting('liveStreams', v)}
              disabled={!preferences.push.enabled}
            />
          </div>
        </div>

        {/* Email Notifications */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Email Notifications</h3>
            <Toggle
              enabled={preferences.email.enabled}
              onChange={(v) => updateEmailSetting('enabled', v)}
            />
          </div>

          <div className={preferences.email.enabled ? '' : 'opacity-50 pointer-events-none'}>
            <div className="py-4 border-b border-gray-700/50">
              <p className="text-white font-medium mb-2">Email Digest</p>
              <p className="text-gray-400 text-sm mb-3">How often to receive summary emails</p>
              <div className="flex gap-2">
                {['none', 'daily', 'weekly'].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateEmailSetting('digest', option)}
                    disabled={!preferences.email.enabled}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      preferences.email.digest === option
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <SettingRow
              icon={Mail}
              title="Marketing Emails"
              description="Product updates and promotions"
              enabled={preferences.email.marketing}
              onChange={(v) => updateEmailSetting('marketing', v)}
              disabled={!preferences.email.enabled}
            />
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-white font-bold">Quiet Hours</h3>
                <p className="text-gray-400 text-sm">Pause notifications during specific hours</p>
              </div>
            </div>
            <Toggle
              enabled={preferences.quiet.enabled}
              onChange={(v) => updateQuietSetting('enabled', v)}
            />
          </div>

          {preferences.quiet.enabled && (
            <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
              <div className="flex-1">
                <label className="block text-gray-400 text-sm mb-2">Start Time</label>
                <input
                  type="time"
                  value={preferences.quiet.startTime}
                  onChange={(e) => updateQuietSetting('startTime', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-400 text-sm mb-2">End Time</label>
                <input
                  type="time"
                  value={preferences.quiet.endTime}
                  onChange={(e) => updateQuietSetting('endTime', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Saving Indicator */}
        {saving && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        )}
      </div>
    </AppLayout>
  );
}
