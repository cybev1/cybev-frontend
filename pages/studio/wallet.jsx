
import React, { useEffect, useState } from 'react';
import StudioLayout from '../../components/layout/StudioLayout';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const simulatedBalance = 257.45;
    const simulatedTransactions = [
      { id: 1, type: 'Earning', amount: 50, description: 'Post engagement reward', date: '2025-05-28' },
      { id: 2, type: 'Mint Fee', amount: -10, description: 'NFT Minting', date: '2025-05-27' },
      { id: 3, type: 'Tip', amount: 100, description: 'User tip', date: '2025-05-25' },
      { id: 4, type: 'Ad Spend', amount: -20, description: 'Post Boost', date: '2025-05-24' },
    ];
    setBalance(simulatedBalance);
    setTransactions(simulatedTransactions);
  }, []);

  return (
    <StudioLayout>
      <h2 className="text-2xl font-bold mb-4">💰 CYBEV Wallet</h2>
      <p className="mb-4"><strong>Wallet Balance:</strong> {balance} CYBEV</p>
      <h3 className="text-xl font-semibold mb-2">Recent Transactions</h3>
      <table className="table-auto w-full text-left border">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Amount (CYBEV)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td className="px-4 py-2">{tx.date}</td>
              <td className="px-4 py-2">{tx.type}</td>
              <td className="px-4 py-2">{tx.description}</td>
              <td className={`px-4 py-2 ${tx.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </StudioLayout>
  );
}
