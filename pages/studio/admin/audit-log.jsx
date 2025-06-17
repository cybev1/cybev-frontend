
import React, { useEffect, useState } from 'react';

export default function AuditLogPage({ userRole = 'super-admin' }) {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    if (userRole !== 'super-admin') return;
    fetch('/api/audit/logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      });
  }, [userRole]);

  useEffect(() => {
    const filtered = logs.filter(log => {
      const emailMatch = log.performedBy?.email?.includes(search) || log.target?.email?.includes(search);
      const actionMatch = actionFilter === 'all' || log.action === actionFilter;
      return emailMatch && actionMatch;
    });
    setFilteredLogs(filtered);
  }, [logs, search, actionFilter]);

  const exportCSV = () => {
    const header = ['Action', 'By', 'Target', 'Details', 'Date'];
    const rows = filteredLogs.map(log => [
      log.action,
      log.performedBy?.email || '',
      log.target?.email || '',
      JSON.stringify(log.metadata),
      new Date(log.timestamp).toLocaleString()
    ]);
    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'audit-logs.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (userRole !== 'super-admin') return null;

  return (
    <div className="p-6 dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-purple-500 mb-6">🧾 Audit Logs</h1>

      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search by email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700"
        />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700"
        >
          <option value="all">All Actions</option>
          <option value="deactivate_user">Deactivated User</option>
          <option value="promote_user">Promoted User</option>
        </select>
        <button
          onClick={exportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          ⬇ Export CSV
        </button>
      </div>

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
              {filteredLogs.map((log) => (
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
