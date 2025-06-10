
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react';

export default function AllTimeLeaderboard() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Simulated fetch from /api/analytics/all-time
    setEntries([
      {
        username: 'prince',
        earnings: 320.45,
        tokens: 782.5,
        mints: 120,
        boosts: 44
      },
      {
        username: 'faithwriter',
        earnings: 290.10,
        tokens: 610.2,
        mints: 105,
        boosts: 37
      },
      {
        username: 'cybevteam',
        earnings: 265.00,
        tokens: 552.0,
        mints: 90,
        boosts: 32
      }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🏆 All-Time Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Earnings ($)</th>
              <th className="p-3 text-left">Tokens (CYBV)</th>
              <th className="p-3 text-left">Mints</th>
              <th className="p-3 text-left">Boosts</th>
              <th className="p-3 text-left">Profile</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3 font-semibold text-blue-700">@{entry.username}</td>
                <td className="p-3 text-green-600">${entry.earnings.toFixed(2)}</td>
                <td className="p-3">{entry.tokens.toFixed(2)}</td>
                <td className="p-3">{entry.mints}</td>
                <td className="p-3">{entry.boosts}</td>
                <td className="p-3">
                  <Link href={`/studio/profile/${entry.username}`}>
                    <span className="text-blue-500 hover:underline">View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
