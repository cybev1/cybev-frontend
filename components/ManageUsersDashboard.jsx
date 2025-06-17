
import React, { useEffect, useState } from 'react';
import UserBadge from '@/components/UserBadge';

export default function ManageUsersDashboard({ userRole = 'super-admin' }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  if (userRole !== 'super-admin') return null;

  return (
    <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-purple-600">📋 Manage Users</h2>

      <div className="mb-4 flex gap-2">
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
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading users...</p>
      ) : (
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
            {filtered.map((user) => (
              <tr key={user._id} className="border-b dark:border-gray-800">
                <td className="py-2">{user.email}</td>
                <td>{user.username || '—'}</td>
                <td><UserBadge role={user.role} /></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
