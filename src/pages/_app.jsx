// ============================================
// FILE: src/pages/_app.jsx
// Main App Wrapper - LIGHT MODE ONLY
// VERSION: 7.1.0 - Clean White Design
// ============================================

import '../styles/globals.css';
import '../styles/pwa.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SocketProvider } from '@/context/SocketContext';
import { Web3Provider } from '@/context/Web3Context';
import { InstallPrompt, OfflineIndicator } from '@/components/PWA/InstallPrompt';
import { useEffect } from 'react';
import Head from 'next/head';

// Force light mode - remove dark class if present
const ForceLightMode = () => {
  const script = `
    (function() {
      // Remove dark mode class - we're light mode only now
      document.documentElement.classList.remove('dark');
      // Prevent dark mode from being set
      localStorage.setItem('cybev_theme', 'light');
    })();
  `;
  
  return (
    <script dangerouslySetInnerHTML={{ __html: script }} />
  );
};

export default function App({ Component, pageProps }) {
  // Force light mode on mount
  useEffect(() => {
    // Remove dark class if present
    document.documentElement.classList.remove('dark');
    // Set theme to light
    localStorage.setItem('cybev_theme', 'light');
  }, []);

  // Register service worker on mount
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[App] Service Worker registered:', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour
        })
        .catch((error) => {
          console.error('[App] Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <>
      <Head>
        {/* Force light mode script */}
        <ForceLightMode />
        
        {/* Fixed light theme color */}
        <meta name="theme-color" content="#ffffff" />
        
        {/* Default meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="color-scheme" content="light" />
      </Head>

      <Web3Provider>
        <SocketProvider>
          {/* Offline status indicator */}
          <OfflineIndicator />
          
          {/* Main app content */}
          <Component {...pageProps} />
          
          {/* PWA Install prompt */}
          <InstallPrompt />
          
          {/* Toast notifications - light theme */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="!rounded-xl !shadow-lg"
          />
        </SocketProvider>
      </Web3Provider>
    </>
  );
}
