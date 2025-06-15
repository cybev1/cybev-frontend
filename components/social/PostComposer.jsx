import React from 'react';

export default function PostComposer() {
  return (
    <div className="p-4 bg-white border rounded">
      <textarea className="w-full p-2 border rounded" placeholder="What's on your mind?" />
      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Post</button>
    </div>
  );
}
