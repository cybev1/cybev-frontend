import React from 'react';

export default function GroupTabsCard() {
  return (
    <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded shadow">
      <h4 className="font-bold mb-2 text-purple-900 dark:text-purple-100">👥 Your Groups</h4>
      <ul className="text-sm text-gray-800 dark:text-gray-100 space-y-1 mb-2">
        <li>#Web3 Builders</li>
        <li>#Christian Creators</li>
        <li>#AI Tools Hub</li>
      </ul>
      <button className="text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">New Post</button>
    </div>
  );
}