import React, { useState } from 'react';

export default function PostComposer() {
  const [text, setText] = useState('');
  return (
    <div className="border p-4 rounded space-y-2">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full h-24 p-2 border rounded"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
    </div>
  );
}
