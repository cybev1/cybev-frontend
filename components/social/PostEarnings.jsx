
import React from 'react';
import { Coins } from 'lucide-react';

export default function PostEarnings({ earnings = 2.4, views = 145, reactions = 18 }) {
  return (
    <div className="flex items-center justify-between text-xs mt-3 px-2 py-1 border-t border-gray-200 dark:border-gray-700 pt-2">
      <div className="text-gray-600 dark:text-gray-300">
        👁 {views} views • ❤️ {reactions} reactions
      </div>
      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 font-medium">
        <Coins className="w-4 h-4" />
        <span>{earnings.toFixed(2)} CYBV</span>
      </div>
    </div>
  );
}
