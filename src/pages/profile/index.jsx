// ============================================
// FILE: src/pages/profile/index.jsx
// Profile Index - Redirects to user's own profile
// FIX: Was showing "User not found"
// ============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Loader2 } from 'lucide-react';

export default function ProfileIndex() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirectToProfile = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
        
        if (!token) {
          // Not logged in - redirect to login
          router.replace('/auth/login?redirect=/profile');
          return;
        }

        // Try to get user data from localStorage first
        const storedUser = localStorage.getItem('user') || localStorage.getItem('cybev_user');
        
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            if (user.username) {
              router.replace(`/profile/${user.username}`);
              return;
            }
          } catch (e) {
            console.log('Could not parse stored user');
          }
        }

        // Fetch user data from API
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token invalid - redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('cybev_token');
            router.replace('/auth/login?redirect=/profile');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const user = data.user || data;

        if (user && user.username) {
          // Store user data for future use
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('cybev_user', JSON.stringify(user));
          
          // Redirect to user's profile
          router.replace(`/profile/${user.username}`);
        } else {
          setError('Could not find your profile. Please try logging in again.');
          setLoading(false);
        }

      } catch (err) {
        console.error('Profile redirect error:', err);
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    };

    redirectToProfile();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <Head>
          <title>Profile - CYBEV</title>
        </Head>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Oops!</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Log In
            </button>
            <button
              onClick={() => router.push('/feed')}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              Go to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <Head>
        <title>Loading Profile - CYBEV</title>
      </Head>
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-300">Loading your profile...</p>
      </div>
    </div>
  );
}
