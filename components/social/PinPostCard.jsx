// components/social/PinPostCard.jsx
import React from 'react';

export default function PinPostCard({ post }) {
  return (
    <div className="bg-yellow-100 p-4 rounded-lg shadow">
      <h2 className="font-semibold">📌 {post.title}</h2>
    </div>
);
}
