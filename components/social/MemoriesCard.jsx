import React from 'react';

export default function MemoriesCard() {
  return (
    <div className="p-4 bg-pink-100 dark:bg-pink-800 rounded shadow">
      <h4 className="font-bold mb-2 text-pink-900 dark:text-pink-100">🕰️ Memories</h4>
      <p className="text-sm text-gray-800 dark:text-pink-200">On this day 1 year ago, you posted:</p>
      <blockquote className="italic text-xs text-gray-600 dark:text-gray-300 mt-1">
        "Building the future of decentralized media..."
      </blockquote>
    </div>
  );
}