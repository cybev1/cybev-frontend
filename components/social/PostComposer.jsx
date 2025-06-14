import React, { useState } from 'react';

export default function PostComposer() {
  const [text, setText] = useState('');
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
      <textarea
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-2"
        placeholder="What's on your mind today?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Attachment</button>
        </div>
        <button className="px-4 py-1 bg-blue-600 text-white rounded-lg">Post</button>
      </div>
    </div>
  );
}
