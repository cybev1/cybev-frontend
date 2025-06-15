// components/social/NewsTicker.jsx
import React from 'react';

export default function NewsTicker({ headlines }) {
  return (
    <marquee className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
      {headlines.join(' • ')}
    </marquee>
);
}
