import React from 'react';

/** Utilities like Memories, Surveys, Funding */
export default function UtilitiesWidget() {
  const items = ['Memories', 'Surveys', 'Funding'];
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 mb-4">
      <h3 className="font-semibold mb-2">Utilities</h3>
      <ul className="space-y-1">
        {items.map(i => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}
