// ============================================
// FILE: src/pages/_app.jsx
// Main App Wrapper with Theme & Auth Providers
// VERSION: 5.0 - With Dark Mode Support
// ============================================

import '../styles/globals.css';
import '../styles/pwa.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SocketProvider } from '@/context/SocketContext';
import { Web3Provider } from '@/context/Web3Context';
import { ThemeProvider } from '@/context/ThemeContext';
import { InstallPrompt, OfflineIndicator } from '@/components/PWA/InstallPrompt';
import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

// Prevent flash of unstyled content
const ThemeScript = () => {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('cybev_theme');
        var user = localStorage.getItem('user');
        var userTheme = null;
        
        if (user) {
          try {
            userTheme = JSON.parse(user).preferences?.theme;
          } catch (e) {}
        }
        
        var selectedTheme = theme || userTheme || 'system';
        var isDark = selectedTheme === 'dark' || 
          (selectedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDark) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    })();
  `;
  
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
};

export default function App({ Component, pageProps }) {
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
        {/* Prevent theme flash */}
        <ThemeScript />
        
        {/* Dynamic theme color */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
        
        {/* Default meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      <ThemeProvider>
        <Web3Provider>
          <SocketProvider>
            {/* Offline status indicator */}
            <OfflineIndicator />
            
            {/* Main app content */}
            <Component {...pageProps} />
            
            {/* PWA Install prompt */}
            <InstallPrompt />
            
            {/* Toast notifications - adapts to theme */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              toastClassName="!rounded-xl"
            />
          </SocketProvider>
        </Web3Provider>
      </ThemeProvider>
    </>
  );
}
