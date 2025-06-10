
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function PostAnalytics() {
  const router = useRouter();
  const { postId } = router.query;

  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (postId) {
      // Simulated API response
      const mock = {
        title: "How Blockchain is Changing Social Media",
        views: 12000,
        shares: 520,
        boosts: 75,
        mints: 37,
        earnings: { cybv: 325.67, usd: 150.23 },
        comments: 342,
        image: "/sample-post.jpg",
        postedAt: "2025-06-08T12:30:00Z",
        chart: [
          { day: 'Mon', views: 2000, shares: 80, boosts: 15, mints: 5 },
          { day: 'Tue', views: 2200, shares: 90, boosts: 10, mints: 8 },
          { day: 'Wed', views: 1800, shares: 70, boosts: 20, mints: 7 },
          { day: 'Thu', views: 2300, shares: 85, boosts: 18, mints: 6 },
          { day: 'Fri', views: 2700, shares: 100, boosts: 12, mints: 11 },
        ],
        earningsChart: [
          { day: 'Mon', usd: 20, cybv: 50 },
          { day: 'Tue', usd: 30, cybv: 65 },
          { day: 'Wed', usd: 25, cybv: 70 },
          { day: 'Thu', usd: 35, cybv: 80 },
          { day: 'Fri', usd: 40, cybv: 60 },
        ]
      };
      setData(mock);
      setChartData(mock.chart);
    }
  }, [postId]);

  if (!data) return <div className="p-4">Loading analytics...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">📊 Post Analytics</h1>
      <p className="text-gray-600 mb-6">Insights for: <strong>{data.title}</strong></p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 shadow rounded-2xl bg-white dark:bg-gray-800">👁️ Views: {data.views}</div>
        <div className="p-4 shadow rounded-2xl bg-white dark:bg-gray-800">🔁 Shares: {data.shares}</div>
        <div className="p-4 shadow rounded-2xl bg-white dark:bg-gray-800">🚀 Boosts: {data.boosts}</div>
        <div className="p-4 shadow rounded-2xl bg-white dark:bg-gray-800">🪙 Earnings: {data.earnings.cybv} CYBV / ${data.earnings.usd}</div>
        <div className="p-4 shadow rounded-2xl bg-white dark:bg-gray-800">🎖️ Mints: {data.mints}</div>
        <div className="p-4 shadow rounded-2xl bg-white dark:bg-gray-800">💬 Comments: {data.comments}</div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">📈 Engagement Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#8884d8" />
            <Line type="monotone" dataKey="shares" stroke="#82ca9d" />
            <Line type="monotone" dataKey="boosts" stroke="#ffc658" />
            <Line type="monotone" dataKey="mints" stroke="#ff8042" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">📊 Earnings Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.earningsChart}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usd" fill="#8884d8" name="USD" />
            <Bar dataKey="cybv" fill="#82ca9d" name="CYBV" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">⬅️ Back to Posts</button>
    </div>
  );
}
