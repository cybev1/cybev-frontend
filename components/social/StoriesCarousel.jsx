import React from 'react';

export default function StoriesCarousel({ stories }) {
  return (
    <div className="flex space-x-4 overflow-x-auto p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
      {stories.map(story => (
        <div key={story.id} className="w-20 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          {story.userName}
        </div>
      ))}
    </div>
);
}
