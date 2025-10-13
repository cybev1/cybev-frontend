import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PostAnalytics() {
  const router = useRouter();
  const { id } = router.query;
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (id) {
      setAnalytics({
        postId: id,
        views: 1482,
        likes: 214,
        comments: 37,
        shares: 19,
        earnings: 58.25,
        minted: true,
        boostCount: 4,
      });
    }
  }, [id]);

  if (!analytics) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 space-y-4">
      <h1 className="text-2xl font-bold">📊 Post Analytics</h1>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          👁 Views: <b>{analytics.views}</b>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          ❤️ Likes: <b>{analytics.likes}</b>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          💬 Comments: <b>{analytics.comments}</b>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          🔗 Shares: <b>{analytics.shares}</b>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          🚀 Boosts: <b>{analytics.boostCount}</b>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          ₿ Earnings: <b>{analytics.earnings} CYBV</b>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow col-span-2">
          🪙 Minted as NFT: <b>{analytics.minted ? 'Yes' : 'No'}</b>
        </div>
      </div>
    </div>
  );
}