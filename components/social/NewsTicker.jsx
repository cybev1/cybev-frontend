import React from 'react';

/** News ticker card */
export default function NewsTicker({ headlines }) {
  return (
    <div className="p-2 bg-white dark:bg-gray-800 rounded-2xl shadow mb-4 overflow-hidden whitespace-nowrap">
      <marquee>{headlines.join(' • ')}</marquee>
    </div>
  );
}
