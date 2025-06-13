import React from 'react';

/** List of user groups */
export default function GroupsList({ groups }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 mb-4">
      <h3 className="font-semibold mb-2">My Groups</h3>
      <ul className="space-y-2">
        {groups.map(g => <li key={g.id}>{g.name}</li>)}
      </ul>
    </div>
  );
}
