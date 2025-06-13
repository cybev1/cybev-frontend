import React from 'react';

/** People you may know */
export default function SuggestedFollowers({ suggestions }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 mb-4">
      <h3 className="font-semibold mb-2">People You May Know</h3>
      <ul className="space-y-2">
        {suggestions.map(u => (
          <li key={u.id} className="flex justify-between items-center">
            <span>{u.name}</span>
            <button className="bg-blue-600 text-white px-2 py-1 rounded">Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
