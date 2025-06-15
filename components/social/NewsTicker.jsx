import React from 'react';

export default function NewsTicker({ headlines }) {
  return (
    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
      <marquee>{headlines.join(' • ')}</marquee>
    </div>
);
}
