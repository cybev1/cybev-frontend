
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function EarningsInsight() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData({
      earningsBreakdown: {
        blog: 120.25,
        video: 54.00,
        nft: 33.75,
        boost: 45.00,
      },
      chart: [
        { day: 'Mon', earnings: 32 },
        { day: 'Tue', earnings: 28 },
        { day: 'Wed', earnings: 40 },
        { day: 'Thu', earnings: 50 },
        { day: 'Fri', earnings: 33 },
        { day: 'Sat', earnings: 35 },
        { day: 'Sun', earnings: 55 },
      ],
      insight: "Boosted AI-generated posts accounted for 42% of your weekly earnings. Videos had the highest engagement-to-earning ratio. Consider repurposing video content into blogs."
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🧠 Earnings Insights</h1>

      {!data ? (
        <p>Loading earnings data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(data.earningsBreakdown).map(([key, val]) => (
              <div key={key} className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow">
                <h2 className="text-sm text-gray-600 capitalize">{key}</h2>
                <p className="text-xl font-bold text-green-600">{val.toFixed(2)} CYBV</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-10">
            <h2 className="text-lg font-semibold mb-3">📊 Earnings Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.chart}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earnings" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">🔍 AI Insight</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">{data.insight}</p>
          </div>
        </>
      )}
    </div>
  );
}
