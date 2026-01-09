// ============================================
// FILE: src/pages/profile/index.jsx
// Profile Index - Redirects to user's own profile
// FIX: Was showing "User not found"
// ============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function ProfileIndex() {
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirectToProfile = async () => {
      try {
        // Get token
        const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
        
        if (!token) {
          router.replace('/auth/login?redirect=/profile');
          return;
        }

        // Try localStorage first
        const storedUser = localStorage.getItem('user') || localStorage.getItem('cybev_user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            if (user && user.username) {
              router.replace(`/profile/${user.username}`);
              return;
            }
          } catch (e) {
            console.log('Parse error:', e);
          }
        }

        // Fetch from API
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('cybev_token');
          router.replace('/auth/login?redirect=/profile');
          return;
        }

        const data = await response.json();
        const user = data.user || data;

        if (user && user.username) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('cybev_user', JSON.stringify(user));
          router.replace(`/profile/${user.username}`);
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Profile redirect error:', err);
        setError('Something went wrong');
      }
    };

    redirectToProfile();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <Head><title>Profile - CYBEV</title></Head>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
          <div className="flex gap-4 justify-center">
            <button onClick={() => router.push('/auth/login')} className="px-6 py-2 bg-purple-600 text-white rounded-lg">
              Log In
            </button>
            <button onClick={() => router.push('/feed')} className="px-6 py-2 bg-white/10 text-white rounded-lg">
              Go to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <Head><title>Loading Profile - CYBEV</title></Head>
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-300">Loading your profile...</p>
      </div>
    </div>
  );
}
