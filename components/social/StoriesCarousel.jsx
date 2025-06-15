import React from 'react';
export default function StoriesCarousel({ stories }) {
  return (
    <div className="flex space-x-2 overflow-x-auto">
      {stories.map(s => <div key={s.id} className="w-24 h-36 bg-gray-200 rounded">{s.title}</div>)}
    </div>
  );
}
