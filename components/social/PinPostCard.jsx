import React from 'react';
export default function PinPostCard({ post }) {
  return <div className="p-4 bg-blue-50 rounded shadow">Pinned: {post.content}</div>;
}
