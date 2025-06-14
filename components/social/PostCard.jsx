import React from 'react';

export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg mb-4">
      <div className="font-semibold">{post.author}</div>
      <div className="text-sm text-gray-500 mb-2">{post.time}</div>
      <p>{post.content}</p>
    </div>
  );
}
