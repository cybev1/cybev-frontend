import React from 'react';
import ViewsCounter from './ViewsCounter';
import ReactionPicker from './ReactionPicker';
import TokenActions from './TokenActions';

export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <img src={post.avatar} alt="" className="w-8 h-8 rounded-full" />
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{post.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{post.time}</div>
          </div>
        </div>
        <div className="text-sm text-blue-600">{post.badge}</div>
      </div>
      {/* Body */}
      <div className="text-gray-700 dark:text-gray-300 mb-2">{post.content}</div>
      {post.image && <img src={post.image} alt="" className="w-full rounded-lg mb-2" />}
      {/* Footer */}
      <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
        <ViewsCounter count={post.views} />
        <ReactionPicker count={post.reactions} />
      </div>
      <TokenActions />
    </div>
  );
}