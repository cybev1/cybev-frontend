// ============================================
// FILE: src/components/PWA/InstallPrompt.jsx
// PATH: cybev-frontend/src/components/PWA/InstallPrompt.jsx
// PURPOSE: PWA install prompt banner component
// ============================================

import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Check, RefreshCw } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function InstallPrompt() {
  const { isInstallable, isInstalled, installPWA, updateAvailable, updateServiceWorker } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed before
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setDismissed(true);
      }
    }

    // Show banner after a delay if installable
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 5000); // Show after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, dismissed]);

  useEffect(() => {
    if (updateAvailable) {
      setShowUpdateBanner(true);
    }
  }, [updateAvailable]);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleUpdate = () => {
    updateServiceWorker();
    setShowUpdateBanner(false);
  };

  // Update available banner
  if (showUpdateBanner) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-4 shadow-2xl z-50 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold">Update Available</h3>
            <p className="text-white/80 text-sm mt-1">
              A new version of CYBEV is ready. Update now for the latest features.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={() => setShowUpdateBanner(false)}
                className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/30 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowUpdateBanner(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  }

  // Install prompt banner
  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg">Install CYBEV</h3>
          <p className="text-white/80 text-sm mt-1">
            Add CYBEV to your home screen for a faster, app-like experience.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/30 transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

// Offline indicator component
export function OfflineIndicator() {
  const { isOnline } = usePWA();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowIndicator(true);
    } else {
      // Hide after a short delay when back online
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showIndicator) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 py-2 px-4 text-center text-sm font-medium z-50 transition-colors ${
      isOnline 
        ? 'bg-green-500 text-white' 
        : 'bg-yellow-500 text-yellow-900'
    }`}>
      {isOnline ? (
        <span className="flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          Back online
        </span>
      ) : (
        <span>You're offline - Some features may be limited</span>
      )}
    </div>
  );
}

// Installed badge for settings
export function InstalledBadge() {
  const { isInstalled } = usePWA();

  if (!isInstalled) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm">
      <Check className="w-4 h-4" />
      App Installed
    </div>
  );
}

export default InstallPrompt;