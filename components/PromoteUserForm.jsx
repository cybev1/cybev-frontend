
import React, { useState } from 'react';

export default function PromoteUserForm({ userRole = 'super-admin' }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [status, setStatus] = useState('');

  const promote = async () => {
    setStatus('Sending...');
    try {
      const res = await fetch('/api/users/promote-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const result = await res.json();
      setStatus(res.ok ? '✅ User promoted successfully!' : `❌ ${result.error}`);
    } catch (error) {
      console.error(error);
      setStatus('❌ Promotion failed.');
    }
  };

  if (userRole !== 'super-admin') return null;

  return (
    <div className="mt-8 p-4 rounded-xl shadow bg-white dark:bg-gray-900 space-y-4">
      <h3 className="text-lg font-bold text-purple-600">🛡 Promote User Role</h3>
      <div className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
          <option value="super-admin">Super Admin</option>
        </select>
        <button
          onClick={promote}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          🚀 Promote
        </button>
        {status && <p className="text-sm text-green-400">{status}</p>}
      </div>
    </div>
  );
}
