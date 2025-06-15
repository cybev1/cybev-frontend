import React from 'react';
import { HeartIcon, EyeIcon, SparklesIcon, ShoppingCartIcon } from 'lucide-react';

export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src={post.avatar} alt="" className="w-8 h-8 rounded-full" />
          <div>
            <div className="font-bold">{post.name}</div>
            <div className="text-xs text-gray-500">{post.time}</div>
          </div>
        </div>
        <div className="text-sm text-blue-500">{post.badge}</div>
      </div>
      {/* Content */}
      <div className="text-gray-800 dark:text-gray-200">{post.content}</div>
      {post.media && <img src={post.media} alt="" className="w-full rounded-lg" />}
      {/* Counters & Actions */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1"><EyeIcon className="w-4 h-4" /><span>{post.views}</span></div>
          <div className="flex items-center space-x-1"><HeartIcon className="w-4 h-4" /><span>{post.likes}</span></div>
          <div className="flex items-center space-x-2">
            {post.reactions.map(r => (
              <span key={r.emoji} className="flex items-center space-x-1">
                <span>{r.emoji}</span><span>{r.count}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1"><SparklesIcon className="w-4 h-4"/>Mint</button>
          <button className="flex items-center space-x-1"><ShoppingCartIcon className="w-4 h-4"/>Stake</button>
        </div>
      </div>
    </div>
);
}
