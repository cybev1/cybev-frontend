
import React, { useEffect, useState } from 'react';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Simulated wallet data
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
    <div style={{ padding: 20 }}>
      <h2>CYBEV Wallet</h2>
      <p><strong>Wallet Balance:</strong> {balance} CYBEV</p>

      <h3>Recent Transactions</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', marginTop: 10 }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount (CYBEV)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.type}</td>
              <td>{tx.description}</td>
              <td style={{ color: tx.amount < 0 ? 'red' : 'green' }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
