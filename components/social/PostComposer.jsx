import React, { useState } from 'react';
export default function PostComposer() {
  const [text, setText] = useState('');
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <textarea
        className="w-full border rounded p-2"
        placeholder="What's on your mind today?"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Post</button>
    </div>
  );
}