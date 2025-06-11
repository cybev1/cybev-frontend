
import React, { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/admin-logs.json')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(() => setLogs([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ClipboardList size={28} /> Admin Activity Logs
      </h1>
      {logs.length === 0 ? (
        <p className="text-gray-500">No activity logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-gray-900 rounded-xl shadow">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Meta Info</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3 text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(log.meta, null, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
