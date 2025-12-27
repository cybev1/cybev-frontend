// ============================================
// FILE: src/components/Mobile/NotificationSettings.jsx
// Push Notification Settings
// ============================================
import { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useOffline } from '@/hooks/useOffline';
import { 
  Bell, BellOff, Smartphone, Trash2, HardDrive,
  Loader2, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function NotificationSettings() {
  const { enabled, loading, enable, disable, refresh } = usePushNotifications();
  const { isOnline, getCacheStats, clearCache } = useOffline();
  const [cacheStats, setCacheStats] = useState(null);

  const handleTogglePush = async () => {
    if (enabled) {
      await disable();
      toast.info('Push notifications disabled');
    } else {
      const success = await enable();
      if (success) {
        toast.success('Push notifications enabled!');
      } else {
        toast.error('Failed to enable notifications');
      }
    }
  };

  const handleRefreshCache = () => {
    const stats = getCacheStats();
    setCacheStats(stats);
  };

  const handleClearCache = () => {
    if (confirm('Clear all cached data? This will remove offline content.')) {
      clearCache();
      setCacheStats(getCacheStats());
      toast.success('Cache cleared');
    }
  };

  return (
    <div className="space-y-6">
      {/* Push Notifications */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Push Notifications</h3>
              <p className="text-gray-400 text-sm">Receive alerts on your device</p>
            </div>
          </div>
          
          <button
            onClick={handleTogglePush}
            disabled={loading}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              enabled ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
            ) : (
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  enabled ? 'left-8' : 'left-1'
                }`}
              />
            )}
          </button>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          enabled 
            ? 'bg-green-500/10 border border-green-500/30' 
            : 'bg-gray-700/50 border border-gray-600'
        }`}>
          {enabled ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm">Notifications enabled</span>
            </>
          ) : (
            <>
              <BellOff className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Notifications disabled</span>
            </>
          )}
        </div>

        {/* Notification Types */}
        {enabled && (
          <div className="mt-4 space-y-3">
            <p className="text-gray-400 text-sm">You'll receive notifications for:</p>
            <div className="grid grid-cols-2 gap-2">
              {['New followers', 'Likes', 'Comments', 'Rewards', 'Mentions', 'Updates'].map((type) => (
                <div key={type} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-3 h-3 text-green-400" />
                  {type}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Offline & Cache */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Offline Storage</h3>
              <p className="text-gray-400 text-sm">Cached data for offline access</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${
            isOnline ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Cache Stats */}
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          {cacheStats ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs">Cached Items</p>
                <p className="text-white font-medium">{cacheStats.itemCount}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Storage Used</p>
                <p className="text-white font-medium">{cacheStats.sizeFormatted}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Pending Actions</p>
                <p className="text-white font-medium">{cacheStats.pendingActions}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleRefreshCache}
              className="w-full flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <RefreshCw className="w-4 h-4" />
              Check cache status
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleRefreshCache}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleClearCache}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </button>
        </div>
      </div>

      {/* Device Info */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Device Info</h3>
            <p className="text-gray-400 text-sm">Current device details</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Platform</span>
            <span className="text-white">
              {typeof window !== 'undefined' && window.Capacitor 
                ? window.Capacitor.getPlatform() 
                : 'Web'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">App Version</span>
            <span className="text-white">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Connection</span>
            <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
              {isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
