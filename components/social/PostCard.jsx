// components/social/PostCard.jsx
import React from 'react';

export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-2">
      <div className="flex items-center space-x-2">
        <img src={post.avatar} alt={post.userName} className="w-8 h-8 rounded-full" />
        <div>
          <p className="font-semibold">{post.userName}</p>
          <p className="text-xs text-gray-500">{post.time}</p>
        </div>
      </div>
      <p>{post.content}</p>
      <div className="flex space-x-4 text-sm text-gray-600">
        <span>👍 {post.likes}</span>
        <span>💬 {post.comments}</span>
        <span>🔄 {post.shares}</span>
      </div>
    </div>
);
}
