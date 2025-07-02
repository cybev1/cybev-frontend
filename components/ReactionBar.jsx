import React from 'react';

export default function ReactionBar({ views, reactions, earnings }) {
  return (
    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 border-t pt-2 flex justify-between">
      <span>👁 {views} views</span>
      <span>❤️ {reactions} reactions</span>
      <span>🪙 ${earnings.toFixed(2)}</span>
    </div>
  );
}