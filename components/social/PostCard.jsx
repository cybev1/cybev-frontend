import React from 'react';

export default function PostCard({ post }) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">{post.title}</h3>
      <p>Post content goes here...</p>
    </div>
  );
}
