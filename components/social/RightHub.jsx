import React from 'react';

export default function RightHub({ data }) {
  return (
    <aside className="hidden xl:block w-60 p-4 bg-white dark:bg-gray-800 border-l space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Followers</h3>
        <ul className="space-y-1">
          {data.followers.map(f => <li key={f.id}>{f.name}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Suggested</h3>
        <ul className="space-y-1">
          {data.suggestions.map(s => <li key={s.id}>{s.name}</li>)}
        </ul>
      </div>
    </aside>
);
}
