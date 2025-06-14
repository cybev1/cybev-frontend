import React from 'react';

export default function PostComposer() {
  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <textarea placeholder="What's on your mind today?" className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600"></textarea>
      <div className="flex justify-between">
        <div className="flex space-x-2">
          {/* TODO: attachment, emoji picker icons */}
          <button>📎</button>
          <button>😊</button>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Post</button>
      </div>
    </div>
  );
}
