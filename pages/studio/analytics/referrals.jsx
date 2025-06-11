
import React, { useEffect, useState } from 'react';
import { Users, Gift } from 'lucide-react';

export default function ReferralRewards() {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    // Simulated fetch from /api/analytics/referrals
    setReferrals([
      { username: 'prince', referrals: 18, earnings: 112.50 },
      { username: 'faithwriter', referrals: 12, earnings: 84.00 },
      { username: 'cybevteam', referrals: 9, earnings: 72.00 },
    ]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Gift size={28} /> Referral Rewards Leaderboard
      </h1>
      {referrals.length === 0 ? (
        <p className="text-gray-500">No referral data found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Referrals</th>
                <th className="p-3 text-left">Earnings (CYBV)</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-semibold text-blue-700">@{r.username}</td>
                  <td className="p-3">{r.referrals}</td>
                  <td className="p-3 text-green-600 font-semibold">🪙 {r.earnings.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
