// ============================================
// FILE: src/pages/offline.jsx
// Offline Page for PWA
// ============================================

import Head from 'next/head';
import { WifiOff, RefreshCw, Home } from 'lucide-react';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      <Head>
        <title>Offline | CYBEV</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-white/50 rounded-full flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-purple-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You're Offline
          </h1>

          {/* Description */}
          <p className="text-gray-500 mb-8 leading-relaxed">
            It looks like you've lost your internet connection. 
            Check your connection and try again.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-medium transition-colors"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>

          {/* Tips */}
          <div className="mt-12 text-left bg-white/30 rounded-2xl p-6">
            <h3 className="text-gray-900 font-medium mb-3">While you're offline:</h3>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Previously viewed content may still be available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Check your WiFi or mobile data connection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Try moving to an area with better signal</span>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <div className="mt-12">
            <span className="text-2xl font-bold text-purple-500">CYBEV</span>
          </div>
        </div>
      </div>
    </>
  );
}

// Static generation for offline page
export async function getStaticProps() {
  return {
    props: {}
  };
}
