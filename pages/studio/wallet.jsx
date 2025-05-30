
import React, { useEffect, useState } from 'react';
import StudioLayout from '../../components/layout/StudioLayout';
import axios from 'axios';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/wallet/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBalance(res.data.balance || 0);
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error('Wallet fetch failed', err);
      }
    };
    fetchWallet();
  }, []);

  return (
    <StudioLayout>
      <h2 className="text-2xl font-bold mb-4">💰 CYBEV Wallet</h2>
      <p className="mb-4"><strong>Wallet Balance:</strong> {balance.toFixed(2)} CYBEV</p>

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
            <tr key={tx._id}>
              <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString()}</td>
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
