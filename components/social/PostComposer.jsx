import React from 'react';

export default function PostComposer() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
      {/* Post Composer stub */}
      <textarea
        className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600"
        placeholder="What's on your mind today?"
      />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Post</button>
    </div>
  );
}
