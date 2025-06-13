// components/social/StoryCard.jsx
import React from 'react';

export default function StoryCard({ story }) {
  return (
    <div className="inline-block mx-2">
      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-500 p-1 cursor-pointer">
        <img src={story.avatar || '/default-avatar.png'} alt={story.userName} className="w-full h-full object-cover" />
      </div>
      <p className="text-center text-sm mt-1">{story.userName}</p>
    </div>
  );
}
