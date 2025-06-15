
import React from 'react';

const liveUsers = [
  {
    id: 1,
    name: 'Prince Dike',
    avatar: '/default-avatar.png',
    live: true,
  },
  {
    id: 2,
    name: 'Jane Doe',
    avatar: '/default-avatar.png',
    live: true,
  },
];

export default function LiveNowStrip() {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 mb-4 rounded-lg shadow flex items-center overflow-x-auto space-x-4">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">🔴 Live Now</h2>
      {liveUsers.map((user) => (
        <div key={user.id} className="relative flex-shrink-0 text-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-lg object-cover border-2 border-red-500"
          />
          <div className="absolute bottom-0 right-0 text-xs bg-red-500 text-white px-1 rounded">
            LIVE
          </div>
          <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">{user.name}</p>
        </div>
      ))}
    </div>
  );
}
