
import React from 'react';
import Link from 'next/link';

export default function CMSDashboard() {
  const modules = [
    { title: 'Members', path: '/studio/cms/members', emoji: '🧑‍🤝‍🧑' },
    { title: 'Groups', path: '/studio/cms/groups', emoji: '👥' },
    { title: 'Progress Tracking', path: '/studio/cms/progress', emoji: '📈' },
    { title: 'Attendance', path: '/studio/cms/attendance', emoji: '📝' },
    { title: 'Giving & Partnership', path: '/studio/cms/giving', emoji: '💰' },
    { title: 'New Member Tracker', path: '/studio/cms/new-members', emoji: '🌱' },
    { title: 'Service Logs', path: '/studio/cms/services', emoji: '📋' },
    { title: 'Admin Reports', path: '/studio/cms/reports', emoji: '📊' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">📡 Community Management Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <Link key={mod.path} href={mod.path}>
            <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:shadow-lg transition text-center">
              <div className="text-4xl mb-2">{mod.emoji}</div>
              <h2 className="text-xl font-semibold">{mod.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
