import React from 'react';

/** Sponsored ad card */
export default function AdCard() {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow mb-4">
      <div className="text-xs text-gray-500 mb-2">Sponsored</div>
      <p>Your ad could appear here.</p>
    </div>
  );
}
