import React, { useState } from 'react';

export default function PostComposer() {
  const [text, setText] = useState('');

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-4">
      <textarea
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Post</button>
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">Mint</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded">Stake</button>
      </div>
    </div>
  );
}