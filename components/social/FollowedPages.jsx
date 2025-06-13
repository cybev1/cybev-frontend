import React from 'react';

/** List of followed pages */
export default function FollowedPages({ pages }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 mb-4">
      <h3 className="font-semibold mb-2">Followed Pages</h3>
      <ul className="space-y-2">
        {pages.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
