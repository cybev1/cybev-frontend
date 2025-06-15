import React from 'react';

export default function StoriesCarousel({ stories }) {
  return (
    <div className="flex space-x-2 overflow-x-auto mb-4">
      <div className="min-w-[100px] h-[150px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">+ Your Story</div>
      {stories.map((_, i) => (
        <div key={i} className="min-w-[100px] h-[150px] bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">Story {i+1}</div>
      ))}
    </div>
  );
}