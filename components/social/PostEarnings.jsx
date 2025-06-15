
import React from 'react';
import { Coins } from 'lucide-react';

export default function PostEarnings({ views = 0, reactions = 0 }) {
  const earnings = ((views + reactions * 2) / 100).toFixed(2); // Calculate dynamically

  return (
    <div className="flex items-center justify-between text-xs mt-3 px-2 py-1 border-t border-gray-200 dark:border-gray-700 pt-2">
      <div className="text-gray-600 dark:text-gray-300">
        👁 {views} views • ❤️ {reactions} reactions
      </div>
      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 font-medium">
        <Coins className="w-4 h-4" />
        <span>{earnings} CYBV</span>
      </div>
    </div>
  );
}
