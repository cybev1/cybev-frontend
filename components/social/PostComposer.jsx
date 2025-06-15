import React, { useState } from 'react';
import { PhotoIcon, VideoIcon, EmojiHappyIcon } from '@heroicons/react/24/outline';

export default function PostComposer() {
  const [text, setText] = useState('');
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <textarea
        className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-lg focus:outline-none"
        rows="3"
        placeholder="What's on your mind today?"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="flex justify-between items-center mt-2 text-gray-500 dark:text-gray-400">
        <div className="flex space-x-4">
          <PhotoIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          <VideoIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          <EmojiHappyIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-1 rounded-lg">Post</button>
      </div>
    </div>
  );
}