import React from 'react';

export default function StakeHistory() {
  return (
    <div className="p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-900 mt-4">
      <h2 className="text-xl font-bold mb-2">Stake History</h2>
      <table className="w-full text-left">
        <thead>
          <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr><td>2025-06-01</td><td>5000 CYBV</td><td>Active</td></tr>
          <tr><td>2025-05-01</td><td>2000 CYBV</td><td>Completed</td></tr>
        </tbody>
      </table>
    </div>
  );
}