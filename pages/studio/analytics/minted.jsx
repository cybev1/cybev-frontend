
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';

export default function MintedLeaderboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulated fetch of minted posts
    setPosts([
      {
        _id: 'm1',
        title: 'The Rise of AI Art',
        mints: 120,
        author: 'prince',
        views: 3100
      },
      {
        _id: 'm2',
        title: 'How to Mint Your First Blog Post',
        mints: 98,
        author: 'web3guru',
        views: 2900
      },
      {
        _id: 'm3',
        title: 'NFTs for Christian Creators',
        mints: 84,
        author: 'faithwriter',
        views: 2700
      }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🎖️ Minted Post Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div key={post._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg relative">
            {index === 0 && (
              <div className="absolute top-2 right-2">
                <BadgeCheck className="text-purple-600" size={28} />
              </div>
            )}
            <h2 className="text-lg font-semibold mb-1 truncate">{post.title}</h2>
            <div className="text-gray-500 text-sm mb-2">👤 {post.author}</div>
            <div className="text-sm text-gray-600">👁️ {post.views} views</div>
            <div className="text-lg font-bold text-indigo-600 mt-2">🎖️ {post.mints} Mints</div>
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
