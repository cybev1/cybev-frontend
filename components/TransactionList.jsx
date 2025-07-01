import { useState } from 'react';

const mockTransactions = [
  { id: 1, type: 'Minted Post', amount: 120.5, date: '2025-06-15' },
  { id: 2, type: 'Referral Bonus', amount: 45, date: '2025-06-14' },
  { id: 3, type: 'Boosted Post Earnings', amount: 22.25, date: '2025-06-13' },
];

export default function TransactionList() {
  const [transactions] = useState(mockTransactions);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">📊 Transaction History</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map(tx => (
          <li key={tx.id} className="py-2 flex justify-between text-sm">
            <span>{tx.type}</span>
            <span>{tx.date}</span>
            <span className="font-semibold">₿ {tx.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}