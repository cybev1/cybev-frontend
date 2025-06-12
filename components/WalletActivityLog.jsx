
import React, { useEffect, useState } from 'react';

export default function WalletActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/wallet/logs')
      .then(res => res.json())
      .then(data => setLogs(data.logs || []));
  }, []);

  return (
    <div className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">Wallet Activity</h2>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-400">No wallet activity yet.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {logs.map((log, i) => (
            <li key={i} className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
              <span className="capitalize">{log.type}</span>
              <span className={log.amount > 0 ? 'text-green-600' : 'text-red-500'}>
                {log.amount > 0 ? '+' : ''}{log.amount} CYBV
              </span>
              <span className="text-gray-400">{new Date(log.date).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
