import React, { useEffect, useState } from 'react';
import { getStakeHistory } from '@/hooks/useStake';

export default function StakeHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getStakeHistory();
      setHistory(data);
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-900 mt-4">
      <h2 className="text-xl font-bold mb-2">Stake History</h2>
      <table className="w-full text-left">
        <thead>
          <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {history.map((item, idx) => (
            <tr key={idx}>
              <td>{new Date(item.startDate).toLocaleDateString()}</td>
              <td>{item.amount} CYBV</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}