
import React from 'react';

export default function TransactionHistory({ transactions = [] }) {
  return (
    <div className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-gray-400">No recent transactions.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {transactions.map((tx, i) => (
            <li key={i} className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
              <span>{tx.type}</span>
              <span className={tx.amount > 0 ? 'text-green-600' : 'text-red-500'}>
                {tx.amount > 0 ? '+' : ''}{tx.amount} CYBV
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
