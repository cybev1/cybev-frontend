import React from 'react';

export default function PostCard() {
  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <p className="font-semibold">User Name</p>
            <p className="text-xs text-gray-500">2h ago</p>
          </div>
        </div>
        <button>•••</button>
      </div>
      {/* Content */}
      <p className="mb-2">Post content goes here...</p>
      {/* Footer */}
      <div className="flex justify-between text-sm text-gray-600">
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>🔁 Share</button>
      </div>
      {/* Actions */}
      <div className="flex justify-around mt-2 text-sm">
        <button>🚀 Boost</button>
        <button>💰 Tip</button>
        <button>🪙 Mint/Stake</button>
      </div>
    </div>
  );
}
