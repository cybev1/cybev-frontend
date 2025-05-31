
import React from 'react';

export default function WalletDashboard() {
  const wallet = {
    balance: 142.75,
    earnings: [
      { source: 'Post #101', amount: 12.5, type: 'Tips', date: '2025-05-28' },
      { source: 'Blog #22', amount: 27.3, type: 'Ad Revenue', date: '2025-05-27' },
      { source: 'Minted Post #88', amount: 18.9, type: 'NFT Sale', date: '2025-05-26' },
      { source: 'Post #97', amount: 8.2, type: 'Tips', date: '2025-05-24' },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">💰 Wallet & Earnings</h1>
      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-lg mb-6 text-center">
        <p className="text-lg">Current Balance</p>
        <h2 className="text-3xl font-bold">${wallet.balance.toFixed(2)} CYBEV</h2>
      </div>

      <h3 className="text-xl font-semibold mb-2">Recent Earnings</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">Source</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount ($CYBEV)</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {wallet.earnings.map((entry, index) => (
              <tr key={index} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3">{entry.source}</td>
                <td className="p-3">{entry.type}</td>
                <td className="p-3 font-semibold">${entry.amount.toFixed(2)}</td>
                <td className="p-3">{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
