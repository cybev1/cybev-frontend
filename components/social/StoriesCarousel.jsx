import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function StoriesCarousel() {
  const { data, error } = useSWR('/api/stories', fetcher);
  if (!data) return null;
  return (
    <div className="flex space-x-4 overflow-x-auto py-2">
      {data.map(story => (
        <div key={story.id} className="w-24 h-40 bg-gray-100 rounded-lg flex-shrink-0">
          <img src={story.thumbUrl} alt="" className="w-full h-3/4 object-cover rounded-t-lg" />
          <div className="text-center text-sm p-1">{story.userName}</div>
        </div>
      ))}
    </div>
  );
}