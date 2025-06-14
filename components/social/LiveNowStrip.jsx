import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function LiveNowStrip() {
  const { data } = useSWR('/api/live-status', fetcher);
  if (!data || !data.isLive) return null;
  return (
    <div className="bg-red-600 text-white text-center p-2 rounded-lg">🔴 Live Now: {data.streamTitle}</div>
  );
}