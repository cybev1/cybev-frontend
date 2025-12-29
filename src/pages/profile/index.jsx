// ============================================
// FILE: src/pages/profile/index.jsx
// PATH: cybev-frontend/src/pages/profile/index.jsx
// PURPOSE: Redirects /profile to user's profile page
// ============================================

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProfileIndex() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.username) {
          router.replace(`/profile/${user.username}`);
        } else {
          router.replace('/auth/login');
        }
      } catch (e) {
        router.replace('/auth/login');
      }
    } else {
      router.replace('/auth/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading profile...</p>
      </div>
    </div>
  );
}
