import React, { useState } from 'react';

export default function PostComposer({ onPost }) {
  const [text, setText] = useState('');
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg mb-4">
      <textarea
        className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600"
        placeholder="What's on your mind today?"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => { onPost(text); setText(''); }}
      >
        Post
      </button>
    </div>
  );
}
