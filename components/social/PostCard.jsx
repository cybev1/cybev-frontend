import React from 'react';
export default function PostCard({ post }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <div className="font-bold">{post.author}</div>
      <div>{post.content}</div>
      <div className="text-gray-500 text-sm">{post.createdAt}</div>
    </div>
  );
}