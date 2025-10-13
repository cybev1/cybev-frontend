import { useEffect, useState } from 'react';
import Head from 'next/head';
import EnhancedSocialFeed from '../../components/social/EnhancedSocialFeed';
import DashboardLayout from '../../components/DashboardLayout';

export default function SocialFeedPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data
    const userData = {
      username: localStorage.getItem('cybev_username') || 'user',
      avatar: localStorage.getItem('cybev_avatar') || '/default-avatar.png',
      tokenBalance: localStorage.getItem('cybev_balance') || '0'
    };
    setUser(userData);
  }, []);

  return (
    <>
      <Head>
        <title>Social Feed - CYBEV</title>
        <meta name="description" content="Connect, share, and earn with the CYBEV social network" />
      </Head>

      <DashboardLayout title="Social Feed">
        <div className="max-w-6xl mx-auto">
          {/* Header Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.username}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Share your thoughts and earn CYBEV tokens
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Your Balance</div>
                <div className="text-2xl font-bold text-green-500">
                  {user?.tokenBalance} CYBV
                </div>
              </div>
            </div>
          </div>

          {/* Earning Info Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">💰 Earn While You Share</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="font-semibold">Create Post</div>
                <div>+5 CYBV tokens</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="font-semibold">Like Posts</div>
                <div>+1 CYBV token</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="font-semibold">Comment</div>
                <div>+2 CYBV tokens</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="font-semibold">Share Content</div>
                <div>+3 CYBV tokens</div>
              </div>
            </div>
          </div>

          {/* Social Feed Component */}
          <EnhancedSocialFeed />
        </div>
      </DashboardLayout>
    </>
  );
}
