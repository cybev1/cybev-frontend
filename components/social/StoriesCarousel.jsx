import React from 'react';

export default function StoriesCarousel({ stories, streamStatus }) {
  return (
    <div className="flex space-x-4 p-4 overflow-x-auto bg-white dark:bg-gray-800">
      {stories.map(story => (
        <div key={story.id} className="w-24 h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          {story.title}
        </div>
      ))}
      <div className="w-24 h-40 bg-blue-500 text-white rounded-lg flex items-center justify-center">
        + Add Story
      </div>
    </div>
  );
}
