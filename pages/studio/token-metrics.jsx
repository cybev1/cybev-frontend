
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TokenMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    setMetrics({
      circulation: 1000000,
      staked: 235000,
      rewardsDistributed: 84000,
      chart: [
        { month: 'Jan', wallets: 120 },
        { month: 'Feb', wallets: 180 },
        { month: 'Mar', wallets: 230 },
        { month: 'Apr', wallets: 260 },
        { month: 'May', wallets: 320 },
        { month: 'Jun', wallets: 410 },
      ]
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🪙 Token Metrics</h1>

      {!metrics ? (
        <p>Loading token data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
              <h2 className="text-sm text-gray-500">CYBV in Circulation</h2>
              <p className="text-2xl font-bold">{metrics.circulation.toLocaleString()} CYBV</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
              <h2 className="text-sm text-gray-500">Tokens Staked</h2>
              <p className="text-2xl font-bold text-yellow-500">{metrics.staked.toLocaleString()} CYBV</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
              <h2 className="text-sm text-gray-500">Rewards Distributed</h2>
              <p className="text-2xl font-bold text-green-600">{metrics.rewardsDistributed.toLocaleString()} CYBV</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-10">
            <h2 className="text-lg font-semibold mb-4">📈 Wallet Growth Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.chart}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wallets" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">🧠 AI Insight (Mock)</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your token ecosystem has seen a <strong>25% increase</strong> in wallet adoption over the past month.
              Consider rewarding long-term stakers or launching a referral-based staking campaign.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
