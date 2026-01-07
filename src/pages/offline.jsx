// ============================================
// FILE: src/pages/offline.jsx
// Offline Page for PWA
// VERSION: 1.0
// ============================================

import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Home } from 'lucide-react';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>Offline | CYBEV</title>
        <meta name="description" content="You're currently offline" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center"
          >
            <WifiOff className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </motion.div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            You're Offline
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            It looks like you've lost your internet connection. Check your connection and try again.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              onClick={handleRetry}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </motion.button>

            <Link href="/">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Home className="w-5 h-5" />
                Go Home
              </motion.span>
            </Link>
          </div>

          {/* Tip */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Some content may be available offline if you've viewed it recently.
            </p>
          </div>

          {/* Logo */}
          <div className="mt-12 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold">CYBEV</span>
          </div>
        </motion.div>
      </div>
    </>
  );
}
