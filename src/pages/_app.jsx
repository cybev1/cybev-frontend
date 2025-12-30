// ============================================
// FILE: src/pages/_app.jsx
// PATH: cybev-frontend/src/pages/_app.jsx
// PURPOSE: Main app wrapper with providers and PWA support
// ============================================

import '../styles/globals.css';
import '../styles/pwa.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SocketProvider } from '@/context/SocketContext';
import { Web3Provider } from '@/context/Web3Context';
import { InstallPrompt, OfflineIndicator } from '@/components/PWA/InstallPrompt';
import { useEffect } from 'react';

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
    <Web3Provider>
      <SocketProvider>
        {/* Offline status indicator */}
        <OfflineIndicator />
        
        {/* Main app content */}
        <Component {...pageProps} />
        
        {/* PWA Install prompt */}
        <InstallPrompt />
        
        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="bg-gray-800 text-white"
        />
      </SocketProvider>
    </Web3Provider>
  );
}
