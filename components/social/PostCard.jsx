import React from 'react';
export default function PostCard({ post }) {
  return <div className="p-4 bg-white rounded shadow">
    <div className="font-bold">{post.author}</div>
    <div>{post.content}</div>
  </div>;
}
