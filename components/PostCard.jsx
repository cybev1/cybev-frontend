
import React from 'react';
import ReactionBar from './ReactionBar';

export default function PostCard({ post }) {
  return (
    <div className="rounded-lg shadow-md p-4 bg-white dark:bg-gray-800 my-4">
      <h2 className="font-bold text-lg">{post.title}</h2>
      <p>{post.content}</p>
      <ReactionBar postId={post.id} />
    </div>
  );
}
