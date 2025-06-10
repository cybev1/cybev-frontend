
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function EarningsLeaderboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulate fetch from /api/analytics/earnings
    setPosts([
      {
        _id: 'p1',
        title: 'AI Content Strategies in 2025',
        earnings: 128.50,
        views: 5200,
        author: 'prince'
      },
      {
        _id: 'p2',
        title: 'Web3 Tools for Creators',
        earnings: 110.25,
        views: 4900,
        author: 'cybevteam'
      },
      {
        _id: 'p3',
        title: 'How to Monetize with NFTs',
        earnings: 103.75,
        views: 4300,
        author: 'web3guru'
      }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🪙 Earnings Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div key={post._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg relative">
            {index === 0 && (
              <div className="absolute top-2 right-2">
                <Trophy className="text-yellow-500" size={28} />
              </div>
            )}
            <h2 className="text-lg font-semibold mb-1 truncate">{post.title}</h2>
            <div className="text-gray-500 text-sm mb-2">👤 {post.author}</div>
            <div className="text-sm text-gray-600">👁️ {post.views} views</div>
            <div className="text-lg font-bold text-green-600 mt-2">🪙 ${post.earnings.toFixed(2)}</div>
            <div className="mt-4 flex gap-3">
              <Link href={`/studio/analytics/post/${post._id}`}>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  📊 View Analytics
                </button>
              </Link>
              <Link href={`/post/${post._id}`}>
                <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                  🔍 View Post
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
