
import React from 'react';
import ReactionBar from './ReactionBar';

export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <img src={post.userAvatar} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">{post.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{post.timeAgo}</p>
        </div>
      </div>
      <div className="text-gray-700 dark:text-gray-300 mb-2">{post.content}</div>
      {post.image && (
        <img src={post.image} alt="post" className="w-full h-auto rounded-md mb-2" />
      )}
      <ReactionBar postId={post.id} />
    </div>
  );
}
