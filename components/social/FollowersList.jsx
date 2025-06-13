import React from 'react';

/** List of followers/friends */
export default function FollowersList({ followers }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 mb-4">
      <h3 className="font-semibold mb-2">Friends</h3>
      <ul className="space-y-2">
        {followers.map(f => (
          <li key={f.id} className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-green-400 rounded-full"></span>
            <span>{f.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
