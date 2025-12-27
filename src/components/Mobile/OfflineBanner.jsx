// ============================================
// FILE: src/components/Mobile/OfflineBanner.jsx
// Offline Status Banner
// ============================================
import { useOffline } from '@/hooks/useOffline';
import { WifiOff, RefreshCw, CloudOff } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, isOffline, pendingCount } = useOffline();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 px-4 py-3 ${
      isOffline 
        ? 'bg-red-600' 
        : 'bg-yellow-600'
    }`}>
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isOffline ? (
            <>
              <WifiOff className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-medium text-sm">You're offline</p>
                <p className="text-white/80 text-xs">Some features may be limited</p>
              </div>
            </>
          ) : (
            <>
              <CloudOff className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-medium text-sm">Syncing...</p>
                <p className="text-white/80 text-xs">{pendingCount} action(s) pending</p>
              </div>
            </>
          )}
        </div>

        {!isOffline && pendingCount > 0 && (
          <RefreshCw className="w-5 h-5 text-white animate-spin" />
        )}
      </div>
    </div>
  );
}
