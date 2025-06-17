
import React, { useEffect, useState } from 'react';
import UserBadge from '@/components/UserBadge';

export default function ManageUsersDashboard({ userRole = 'super-admin' }) {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'super-admin') return;
    fetch('/api/users/list')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, [userRole]);

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);
  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const exportCSV = () => {
    const header = ['Email', 'Username', 'Role', 'Joined'];
    const rows = filtered.map((u) => [
      u.email,
      u.username || '',
      u.role,
      new Date(u.createdAt).toLocaleDateString()
    ]);
    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cybev-users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (userRole !== 'super-admin') return null;

  return (
    <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-purple-600">📋 Manage Users</h2>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="moderator">Moderators</option>
          <option value="admin">Admins</option>
          <option value="super-admin">Super Admins</option>
        </select>
        <button onClick={exportCSV} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          ⬇ Export CSV
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="py-2">Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user._id} className="border-b dark:border-gray-800">
                  <td className="py-2">{user.email}</td>
                  <td>{user.username || '—'}</td>
                  <td><UserBadge role={user.role} /></td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-sm rounded disabled:opacity-40"
            >
              ◀ Prev
            </button>
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-sm rounded disabled:opacity-40"
            >
              Next ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
