import React from 'react';

export default function PinPostCard({ post }) {
  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow">
      📌 {post.title}
    </div>
);
}
