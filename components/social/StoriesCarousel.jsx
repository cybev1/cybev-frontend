// components/social/StoriesCarousel.jsx
import React from 'react';

export default function StoriesCarousel({ stories }) {
  return (
    <div className="flex space-x-4 overflow-x-auto">
      {stories.map(s => (
        <div key={s.id} className="flex-shrink-0 w-16 text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto">
            {s.avatar ? <img src={s.avatar} alt={s.userName} className="w-full h-full rounded-full" /> : <span className="block p-4">+</span>}
          </div>
          <p className="text-xs mt-1">{s.userName}</p>
        </div>
      ))}
    </div>
);
}
