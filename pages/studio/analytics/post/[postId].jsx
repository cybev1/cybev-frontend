
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PostAnalytics() {
  const router = useRouter();
  const { postId } = router.query;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (postId) {
      // Mock fetch
      setData({
        title: "How Blockchain is Changing Social Media",
        views: 12000,
        shares: 520,
        boosts: 75,
        mints: 37,
        earnings: { cybv: 325.67, usd: 150.23 },
        comments: 342,
        image: "/sample-post.jpg",
        postedAt: "2025-06-08T12:30:00Z"
      });
    }
  }, [postId]);

  if (!data) return <div className="p-4">Loading analytics...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">📊 Post Analytics</h1>
      <p className="text-gray-600 mb-4">Performance insights for: <strong>{data.title}</strong></p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 shadow-lg rounded-2xl bg-white dark:bg-gray-800">👁️ Views: {data.views}</div>
        <div className="p-4 shadow-lg rounded-2xl bg-white dark:bg-gray-800">🔁 Shares: {data.shares}</div>
        <div className="p-4 shadow-lg rounded-2xl bg-white dark:bg-gray-800">🚀 Boosts: {data.boosts}</div>
        <div className="p-4 shadow-lg rounded-2xl bg-white dark:bg-gray-800">🪙 Earnings: {data.earnings.cybv} CYBV / ${data.earnings.usd}</div>
        <div className="p-4 shadow-lg rounded-2xl bg-white dark:bg-gray-800">🎖️ Mints: {data.mints}</div>
        <div className="p-4 shadow-lg rounded-2xl bg-white dark:bg-gray-800">💬 Comments: {data.comments}</div>
      </div>
      <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">⬅️ Back to Posts</button>
    </div>
  );
}
