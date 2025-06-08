import { useEffect, useState } from 'react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const blogId = 'mock-blog-id-123'; // Replace with real blog ID in production

  useEffect(() => {
    const loadAnalytics = async () => {
      const res = await fetch('/api/analytics/earnings?blogId=' + blogId);
      const json = await res.json();
      if (json.success) setData(json.earnings);
      setLoading(false);
    };

    loadAnalytics();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📊 Blog Analytics Summary</h1>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <div className="bg-white shadow rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <h2 className="text-xl font-semibold text-blue-700">{data.totalPosts}</h2>
              <p className="text-gray-600">Total Posts</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-indigo-700">{data.totalViews}</h2>
              <p className="text-gray-600">Total Views</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-700">{data.totalShares}</h2>
              <p className="text-gray-600">Total Shares</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-600">${data.estEarnings}</h2>
              <p className="text-gray-600">Earnings</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-4">
            This is a simulated earnings dashboard. Geo/device breakdown coming next.
          </p>
        </div>
      )}
    </div>
  );
}