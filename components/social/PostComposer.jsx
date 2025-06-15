// components/social/PostComposer.jsx
import React, { useState } from 'react';

export default function PostComposer() {
  const [text, setText] = useState('');

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        placeholder="What's on your mind?"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Post</button>
    </div>
);
}
