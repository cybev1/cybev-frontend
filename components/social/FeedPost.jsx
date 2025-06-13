// components/social/FeedPost.jsx
import React from 'react';

export default function FeedPost({ post }) {
  return (
    <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform hover:-translate-y-1 transition">
      <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>👍 {post.likes}</span>
        <span>💬 {post.commentsCount}</span>
        <span>🔁 {post.shares}</span>
        <span>🚀 Boost</span>
        <span>💰 Tip</span>
      </div>
      <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
        Earned: {post.earnings} CYBV
      </div>
    </div>
  );
}
