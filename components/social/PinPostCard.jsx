import React from 'react';

/** Card for pinned post */
export default function PinPostCard({ post }) {
  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-2xl shadow mb-4">
      <div className="text-sm uppercase font-bold">Pinned</div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
    </div>
  );
}
