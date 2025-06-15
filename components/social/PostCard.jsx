import React from 'react';

export default function PostCard() {
  return (
    <div className="border p-4 rounded space-y-2">
      <div className="flex justify-between">
        <div className="font-bold">User Name</div>
        <div className="text-sm text-gray-500">2h ago</div>
      </div>
      <div>This is a sample post content. It can include text, images, etc.</div>
      <div className="flex justify-between text-sm text-gray-600">
        <div>👍 10</div>
        <div>💬 5</div>
        <div>👀 20 views</div>
      </div>
      <div className="flex space-x-4 text-blue-600">
        <button>Like</button>
        <button>Comment</button>
        <button>Share</button>
      </div>
    </div>
  );
}
