import React from 'react';

export default function PinPostCard({ post }) {
  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-800 rounded-lg mb-4">
      <div className="font-semibold">📌 Pinned Post</div>
      <div>{post?.title}</div>
    </div>
  );
}