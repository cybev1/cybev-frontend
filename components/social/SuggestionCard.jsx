import React from 'react';

export default function SuggestionCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 p-4">
      <div className="font-bold mb-2">People You May Know</div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-8 h-8 bg-gray-300 rounded-full"></span>
            <div>User A</div>
          </div>
          <button className="px-2 py-1 bg-blue-600 text-white rounded">Follow</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-8 h-8 bg-gray-300 rounded-full"></span>
            <div>User B</div>
          </div>
          <button className="px-2 py-1 bg-blue-600 text-white rounded">Follow</button>
        </div>
      </div>
    </div>
  );
}
