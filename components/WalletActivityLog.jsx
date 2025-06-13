
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Wallet Activity</h2>
        <div className="flex gap-4 text-sm">
          <a href="/api/wallet/export-csv" download className="text-blue-600 hover:underline">📤 CSV</a>
          <a href="/api/wallet/export-pdf" download className="text-purple-600 hover:underline">🖨️ PDF</a>
        </div>
      </div>
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
