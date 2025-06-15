// components/social/RightHub.jsx
import React from 'react';

export default function RightHub({ data }) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 space-y-6">
      <div>
        <h3 className="font-semibold">Followers</h3>
        <ul className="mt-2 space-y-1">
          {data.followers.map(u => <li key={u.id}>{u.name}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">Suggestions</h3>
        <ul className="mt-2 space-y-1">
          {data.suggestions.map(u => <li key={u.id}>{u.name}</li>)}
        </ul>
      </div>
    </aside>
);
}
