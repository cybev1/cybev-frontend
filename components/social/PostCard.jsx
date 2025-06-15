import React from 'react';

export default function PostCard({ post }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-4">
      <div className="mb-2 font-semibold">{post.author} <span className="text-gray-500">• {post.time}</span></div>
      <div className="mb-2">{post.content}</div>
      <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
        <span>👍 {post.likes}</span>
        <span>💬 {post.comments}</span>
        <span>🔄 {post.shares}</span>
        <span>👁️ {post.views}</span>
      </div>
    </div>
  );
}