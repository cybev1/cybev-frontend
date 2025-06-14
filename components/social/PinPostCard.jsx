import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function PinPostCard() {
  const { data, error } = useSWR('/api/posts/pinned', fetcher);

  if (error) return null;
  if (!data) return null;

  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow mb-4">
      <h3 className="font-semibold mb-2">Pinned Post</h3>
      <p className="font-bold">{data.title}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300">{data.excerpt}</p>
    </div>
  );
}
