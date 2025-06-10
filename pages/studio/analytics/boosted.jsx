
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown } from 'lucide-react';

export default function BoostedLeaderboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulated fetch from /api/posts/boosted
    setPosts([
      {
        _id: 'post1',
        title: 'How AI Will Change the World',
        views: 3200,
        shares: 120,
        boosts: 45,
        earnings: 78.32,
        minted: true
      },
      {
        _id: 'post2',
        title: 'Web3 Social Media is the Future',
        views: 2800,
        shares: 100,
        boosts: 40,
        earnings: 63.10,
        minted: false
      },
      {
        _id: 'post3',
        title: 'Top 10 Blockchain Projects in 2025',
        views: 2500,
        shares: 90,
        boosts: 32,
        earnings: 55.45,
        minted: true
      }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🚀 Boosted Post Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div key={post._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md relative">
            {index === 0 && (
              <div className="absolute top-2 right-2">
                <Crown className="text-yellow-500" size={28} />
              </div>
            )}
            <h2 className="text-lg font-semibold truncate">{post.title}</h2>
            <div className="text-sm text-gray-500 mt-1">
              👁️ {post.views} | 🔁 {post.shares} | 🚀 {post.boosts} | 🪙 ${post.earnings.toFixed(2)}
            </div>
            {post.minted && <div className="mt-2 inline-block px-2 py-1 text-xs text-green-800 bg-green-100 rounded">Minted NFT</div>}
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
