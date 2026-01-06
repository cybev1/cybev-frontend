// ============================================
// FILE: src/pages/auth/oauth-callback.jsx
// OAuth Callback Handler
// Receives token from OAuth providers and stores it
// ============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function OAuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const handleCallback = async () => {
      const { token, new: isNew, error, message: errorMessage } = router.query;

      // Wait for query params to be available
      if (!router.isReady) return;

      if (error) {
        setStatus('error');
        setMessage(decodeURIComponent(errorMessage || 'Authentication failed'));
        if (toast?.error) {
          toast.error('Sign in failed');
        }
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
        return;
      }

      if (token) {
        try {
          // Store the token
          localStorage.setItem('token', token);
          localStorage.setItem('cybev_token', token);
          
          console.log('OAuth callback - Token received, fetching user...');

          // Fetch user data
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io'}/api/auth/me`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          console.log('OAuth callback - Response status:', response.status);

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();
          console.log('OAuth callback - User data:', data);
          
          // Handle different response formats (ok, success, or direct user object)
          const user = data.user || data.data || data;
          const isSuccess = data.ok || data.success || (user && user._id);
          
          if (isSuccess && user) {
            localStorage.setItem('user', JSON.stringify(user));
            
            setStatus('success');
            setMessage(isNew === '1' ? 'Account created!' : 'Welcome back!');
            if (toast?.success) {
              toast.success(isNew === '1' ? 'Account created successfully!' : 'Welcome back!');
            }

            // Redirect based on onboarding status
            setTimeout(() => {
              if (isNew === '1' || !user.hasCompletedOnboarding) {
                router.push('/onboarding');
              } else {
                router.push('/feed');
              }
            }, 1500);
          } else {
            console.error('OAuth callback - Invalid data structure:', data);
            throw new Error('Invalid user data');
          }
        } catch (err) {
          console.error('OAuth callback error:', err);
          setStatus('error');
          setMessage('Failed to complete sign in');
          if (toast?.error) {
            toast.error('Something went wrong');
          }
          
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        }
      } else if (router.isReady) {
        // No token and no error - invalid state
        setStatus('error');
        setMessage('Invalid callback. Please try again.');
        
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    };

    handleCallback();
  }, [router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>Signing In... | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center"
        >
          {status === 'processing' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <Loader2 className="w-16 h-16 text-purple-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Almost there...</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{message}</h2>
              <p className="text-gray-600">Redirecting you now...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
              >
                <XCircle className="w-10 h-10 text-red-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In Failed</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => router.push('/auth/login')}
                className="text-purple-600 font-semibold hover:underline"
              >
                Back to Sign In
              </button>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
