import React from 'react';

export default function StoriesCarousel() {
  return (
    <div className="flex space-x-4 overflow-auto">
      {['Your Story', 'Alice', 'Bob', 'Eve'].map(name => (
        <div key={name} className="flex-shrink-0 w-24 h-36 bg-gray-200 rounded flex items-end p-2">
          <div className="bg-white px-1 rounded">{name}</div>
        </div>
      ))}
    </div>
  );
}
