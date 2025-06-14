import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
export default function PinPostCard() {
  const fetcher = url => axios.get(url).then(res => res.data);
  const { data } = useSWR('/api/posts/pinned', fetcher);
  if (!data) return null;
  return (
    <div className="bg-yellow-100 p-4 rounded-lg shadow">
      <div className="font-bold">📌 Pinned Post</div>
      <div>{data.title}</div>
    </div>
  );
}