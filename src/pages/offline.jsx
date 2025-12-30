// ============================================
// FILE: src/pages/offline.jsx
// PATH: cybev-frontend/src/pages/offline.jsx
// PURPOSE: Offline fallback page for PWA
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { WifiOff, RefreshCw, Home, Loader2 } from 'lucide-react';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-redirect when back online
      setTimeout(() => {
        router.back();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      // Try to fetch a small resource to check connectivity
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-store' 
      });
      
      if (response.ok) {
        router.back();
      }
    } catch (error) {
      // Still offline
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    router.push('/feed');
  };

  return (
    <>
      <Head>
        <title>You're Offline - CYBEV</title>
        <meta name="description" content="No internet connection" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center animate-pulse">
                <WifiOff className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            
            {/* Connection status indicator */}
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium ${
              isOnline 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {isOnline ? '● Online' : '○ Offline'}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {isOnline ? 'Back Online!' : "You're Offline"}
          </h1>

          {/* Message */}
          <p className="text-gray-400 mb-8 leading-relaxed">
            {isOnline 
              ? 'Your connection has been restored. Redirecting you back...'
              : "It looks like you've lost your internet connection. Some features may be limited until you're back online."
            }
          </p>

          {/* Actions */}
          {!isOnline && (
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking connection...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </>
                )}
              </button>

              <button
                onClick={handleGoHome}
                className="w-full px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2 border border-gray-700"
              >
                <Home className="w-5 h-5" />
                Go to Feed (Cached)
              </button>
            </div>
          )}

          {/* Offline Features */}
          {!isOnline && (
            <div className="mt-12 text-left">
              <h3 className="text-white font-semibold mb-4 text-center">What you can do offline:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📖</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Read cached content</p>
                    <p className="text-gray-500 text-sm">View previously loaded posts and blogs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">✏️</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Draft content</p>
                    <p className="text-gray-500 text-sm">Write posts that sync when online</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔖</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">View bookmarks</p>
                    <p className="text-gray-500 text-sm">Access your saved items offline</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logo */}
          <div className="mt-12 flex items-center justify-center gap-2 text-gray-500">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold">CYBEV</span>
          </div>
        </div>
      </div>
    </>
  );
}
