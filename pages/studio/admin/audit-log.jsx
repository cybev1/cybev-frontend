
import React, { useEffect, useState } from 'react';

export default function AuditLogPage({ userRole = 'super-admin' }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'super-admin') return;
    fetch('/api/audit/logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      });
  }, [userRole]);

  if (userRole !== 'super-admin') return null;

  return (
    <div className="p-6 dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-purple-500 mb-6">🧾 Audit Logs</h1>

      {loading ? (
        <p className="text-sm text-gray-400">Loading logs...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-900 p-4 shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="py-2">Action</th>
                <th>By</th>
                <th>Target</th>
                <th>Details</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b dark:border-gray-800">
                  <td className="py-2">{log.action}</td>
                  <td>{log.performedBy?.email || '—'}</td>
                  <td>{log.target?.email || '—'}</td>
                  <td>{JSON.stringify(log.metadata)}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
