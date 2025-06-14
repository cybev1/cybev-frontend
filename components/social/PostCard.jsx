import React from 'react';

export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-8 h-8 bg-gray-300 rounded-full"></span>
          <div>
            <div className="font-bold">User Name</div>
            <div className="text-xs text-gray-500">Just now</div>
          </div>
        </div>
        <div>...</div>
      </div>
      <div className="mb-2">This is a sample post.</div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>🔁 Share</button>
      </div>
    </div>
  );
}
