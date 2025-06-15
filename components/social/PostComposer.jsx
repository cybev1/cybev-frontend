import React, { useState } from 'react';

export default function PostComposer() {
  const [text, setText] = useState('');
  return (
    <div className="mb-4 p-4 border rounded">
      <textarea
        className="w-full p-2 mb-2 border rounded"
        rows="3"
        placeholder="What's on your mind?"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Post</button>
    </div>
  );
}
