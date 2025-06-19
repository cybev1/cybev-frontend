
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PostAnalytics() {
  const router = useRouter();
  const { id } = router.query;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/analytics/post/${id}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/studio/blogs">
            <span className="text-blue-600 hover:underline">← Back to My Blogs</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-4">📊 Post Analytics</h1>
        {loading ? (
          <p>Loading analytics...</p>
        ) : stats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl">
                <h2 className="text-lg font-semibold">👁 Views</h2>
                <p className="text-2xl font-bold">{stats.views || 0}</p>
              </div>
              <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-xl">
                <h2 className="text-lg font-semibold">❤️ Reactions</h2>
                <p className="text-2xl font-bold">{stats.reactions || 0}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-xl">
                <h2 className="text-lg font-semibold">🔁 Shares</h2>
                <p className="text-2xl font-bold">{stats.shares || 0}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl">
                <h2 className="text-lg font-semibold">💸 Earnings</h2>
                <p className="text-2xl font-bold">₿ {stats.earnings?.toFixed(2) || "0.00"} CYBV</p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <h2 className="text-lg font-semibold mb-2">🔗 Mint & Boost Status</h2>
              <p>✅ Minted: {stats.minted ? 'Yes' : 'No'}</p>
              <p>🚀 Boosted: {stats.boosted ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ) : (
          <p>No analytics found for this post.</p>
        )}
      </div>
    </div>
  );
}
