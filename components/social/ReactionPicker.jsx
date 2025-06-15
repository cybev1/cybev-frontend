import React from 'react';

export default function ReactionPicker({ onReact }) {
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  return (
    <div className="flex space-x-2 mt-2">
      {reactions.map(reaction => (
        <button key={reaction} onClick={() => onReact(reaction)} className="p-1 hover:bg-gray-200 rounded-full">
          <span>{reaction}</span>
        </button>
      ))}
    </div>
  );
}
