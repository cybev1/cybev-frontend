import React from 'react';

export default function LiveNowStrip({ stream }) {
  return (
    <div className="p-4 bg-red-100 dark:bg-red-800 rounded-lg mb-4">
      <span className="font-semibold">🔴 Live Now: {stream?.title}</span>
    </div>
  );
}