
import React from 'react';

const suggested = [
  { id: 1, name: 'CryptoQueen', handle: '@cryptoqueen', avatar: '/default-avatar.png' },
  { id: 2, name: 'TechGuru', handle: '@techguru', avatar: '/default-avatar.png' },
  { id: 3, name: 'WordSmith', handle: '@wordsmith', avatar: '/default-avatar.png' }
];

export default function SuggestedFollowers() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">👥 People You May Know</h3>
      <ul className="space-y-3">
        {suggested.map(user => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={user.avatar} className="w-10 h-10 rounded-full" alt={user.name} />
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user.handle}</div>
              </div>
            </div>
            <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
