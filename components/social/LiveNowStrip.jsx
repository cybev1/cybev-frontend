import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function LiveNowStrip() {
  const { data, error } = useSWR('/api/live-status', fetcher);

  if (error) return null;
  if (!data) return null;
  if (!data.isLive) return null;

  return (
    <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 rounded-lg text-center font-semibold text-red-600 cursor-pointer">
      🔴 {data.message} - Click to watch
    </div>
  );
}
