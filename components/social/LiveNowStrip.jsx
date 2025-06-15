import React from 'react';

export default function LiveNowStrip({ live }) {
  if (!live.isLive) return null;
  return (
    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
      {live.title}
    </div>
  );
}
