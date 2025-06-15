import React from 'react';
import { FaceSmileIcon } from '@heroicons/react/24/outline';

export default function PostComposer() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <textarea
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded resize-none"
        rows="3"
        placeholder="What's on your mind today?"
      ></textarea>
      <div className="flex items-center justify-between mt-2">
        <div className="flex space-x-2 items-center">
          <FaceSmileIcon className="w-5 h-5 text-gray-500" />
          <button className="text-blue-500 text-sm">Add Emoji</button>
        </div>
        <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          Post
        </button>
      </div>
    </div>
  );
}
