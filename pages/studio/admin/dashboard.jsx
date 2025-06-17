
import React from 'react';
import Link from 'next/link';

const tools = [
  { name: 'Manage Users', href: '/studio/admin', icon: '👥' },
  { name: 'Promote Roles', href: '/studio/admin', icon: '🛡' },
  { name: 'Audit Logs', href: '/studio/admin/audit-log', icon: '🧾' },
  { name: 'Report Archive', href: '/studio/admin/audit-archive', icon: '📂' },
  { name: 'Export PDF Report', href: '/api/audit/export-pdf', icon: '⬇' },
  { name: 'System Settings', href: '#', icon: '⚙️' },
];

export default function AdminDashboardPage({ userRole = 'super-admin' }) {
  if (userRole !== 'super-admin') return null;

  return (
    <div className="min-h-screen dark:bg-black p-6">
      <h1 className="text-3xl font-bold text-purple-500 mb-8">🧭 Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tools.map((tool, i) => (
          <Link href={tool.href} key={i} className="group block bg-white dark:bg-gray-900 shadow rounded-xl p-6 hover:ring-2 ring-purple-500 transition-all">
            <div className="text-3xl mb-3">{tool.icon}</div>
            <div className="text-lg font-semibold group-hover:text-purple-500">{tool.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
