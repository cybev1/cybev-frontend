import React from 'react';

export default function PostComposer() {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <input
        type="text"
        placeholder="What's on your mind today?"
        className="w-full p-2 border rounded"
      />
    </div>
);
}
