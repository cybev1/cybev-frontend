import React from 'react';

export default function PostCard({ post }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-2">
      <div className="flex items-center space-x-2">
        <img src={post.avatar} alt="" className="w-8 h-8 rounded-full" />
        <div>
          <p className="font-semibold">{post.userName}</p>
          <p className="text-xs text-gray-500">{post.time}</p>
        </div>
      </div>
      <p>{post.content}</p>
    </div>
);
}
