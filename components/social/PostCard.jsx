import React from 'react';

/** Individual post card */
export default function PostCard({ post }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <img src={post.avatar} alt="" className="w-8 h-8 rounded-full"/>
          <div>
            <div className="font-semibold">{post.userName}</div>
            <div className="text-xs text-gray-500">{post.time}</div>
          </div>
        </div>
        <div>...</div>
      </div>
      <p className="mb-4">{post.content}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>👍 {post.likes}</span>
        <span>💬 {post.comments}</span>
        <span>🔁 {post.shares}</span>
      </div>
    </div>
  );
}
