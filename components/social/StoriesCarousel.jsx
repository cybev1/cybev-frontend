import React from 'react';

export default function StoriesCarousel({ stories }) {
  return (
    <div className="flex space-x-2 overflow-x-auto mb-4">
      {stories.map(s => (
        <div key={s.id} className="relative w-24 h-40 bg-gray-200 rounded-lg overflow-hidden">
          <img src={s.image} alt={s.label} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center">{s.label}</div>
          {s.isLive && <span className="absolute top-1 left-1 px-1 text-xs bg-red-600 text-white rounded">LIVE</span>}
          {s.isUser && <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-500 opacity-75">+</div>}
        </div>
      ))}
    </div>
  );
}
