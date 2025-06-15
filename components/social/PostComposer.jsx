
import React, { useState } from 'react';
import { EmojiHappyIcon, CashIcon } from '@heroicons/react/outline';

export default function PostComposer() {
  const [content, setContent] = useState('');
  const [monetize, setMonetize] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const addEmoji = (emoji) => {
    setContent(prev => prev + emoji);
    setEmojiPickerOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind today?"
        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded mb-2 dark:bg-gray-900 dark:text-white"
        rows={3}
      />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <button onClick={() => setEmojiPickerOpen(prev => !prev)} className="text-gray-600 dark:text-gray-300">
            <EmojiHappyIcon className="w-5 h-5" />
          </button>
          {emojiPickerOpen && (
            <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded shadow">
              {['👍', '🔥', '😂', '❤️', '🙏'].map(emoji => (
                <button key={emoji} onClick={() => addEmoji(emoji)} className="text-xl">
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <label className="flex items-center text-sm space-x-1 cursor-pointer">
            <input type="checkbox" checked={monetize} onChange={() => setMonetize(!monetize)} />
            <span className="text-gray-600 dark:text-gray-300">Monetize</span>
          </label>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">Boost</button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs">Tip</button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">Mint</button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs">Stake</button>
        </div>
      </div>
    </div>
  );
}
