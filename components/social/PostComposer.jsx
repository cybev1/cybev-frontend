import React from 'react';

/** Post composer with attachments and actions */
export default function PostComposer() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 mb-4">
      <textarea placeholder="What's on your mind today?" className="w-full p-2 border rounded mb-2"></textarea>
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button>📎</button>
          <button>😀</button>
        </div>
        <button className="bg-blue-600 text-white px-4 py-1 rounded">Post</button>
      </div>
    </div>
  );
}
