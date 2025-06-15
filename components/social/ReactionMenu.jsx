import React, { useState } from 'react';

const emojis = [
  { label: 'Like', symbol: '👍' },
  { label: 'Love', symbol: '❤️' },
  { label: 'Haha', symbol: '😂' },
  { label: 'Wow', symbol: '😮' },
  { label: 'Sad', symbol: '😢' },
  { label: 'Angry', symbol: '😡' },
];

export default function ReactionMenu({ currentReaction, onReact }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="text-xl"
      >
        {currentReaction
          ? emojis.find(e => e.label === currentReaction)?.symbol
          : '👍'}
      </button>
      {open && (
        <div className="absolute bottom-full flex space-x-2 mb-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-50">
          {emojis.map(e => (
            <button
              key={e.label}
              onClick={() => {
                onReact(e.label);
                setOpen(false);
              }}
              className="text-xl focus:outline-none"
            >
              {e.symbol}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
