
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const tiles = [
  { name: 'Manage Users', href: '/studio/admin', icon: '👥' },
  { name: 'Audit Logs', href: '/studio/admin/audit-log', icon: '🧾' },
  { name: 'Archive Reports', href: '/studio/admin/audit-archive', icon: '📂' },
  { name: 'Export Audit PDF', href: '/api/audit/export-pdf', icon: '⬇' },
];

export default function AdminDashboardPage({ userRole = 'super-admin' }) {
  const [summary, setSummary] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/admin/summary').then(res => res.json()).then(setSummary);
    fetch('/api/audit/recent').then(res => res.json()).then(data => setLogs(data.logs || []));
  }, []);

  if (userRole !== 'super-admin') return null;

  return (
    <div className="min-h-screen dark:bg-black p-6">
      <h1 className="text-3xl font-bold text-purple-500 mb-6">🧭 Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">Users</p>
          <h2 className="text-xl font-bold text-purple-600">{summary.users || 0}</h2>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">Posts</p>
          <h2 className="text-xl font-bold text-purple-600">{summary.posts || 0}</h2>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">Views</p>
          <h2 className="text-xl font-bold text-purple-600">{summary.views || 0}</h2>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">Earnings</p>
          <h2 className="text-xl font-bold text-purple-600">${summary.earnings || 0}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {tiles.map((tool, i) => (
          <Link href={tool.href} key={i} className="group block bg-white dark:bg-gray-900 shadow rounded-xl p-6 hover:ring-2 ring-purple-500 transition-all">
            <div className="text-3xl mb-3">{tool.icon}</div>
            <div className="text-lg font-semibold group-hover:text-purple-500">{tool.name}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
        <h3 className="text-lg font-bold mb-2">🕓 Recent Admin Activity</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          {logs.map((log, i) => (
            <li key={i}>
              <strong>{log.performedBy?.email}</strong> {log.action} <strong>{log.target?.email}</strong> on {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
