import React from 'react';

export default function GameCenterCard() {
  return (
    <div className="p-4 bg-indigo-100 dark:bg-indigo-800 rounded shadow">
      <h4 className="font-bold mb-2 text-indigo-900 dark:text-indigo-100">🎮 Play & Earn</h4>
      <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">Spin the Wheel • Quiz to Win</p>
      <button className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Launch Games</button>
    </div>
  );
}