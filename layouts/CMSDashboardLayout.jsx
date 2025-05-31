
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const tabs = [
  { label: 'Members', href: '/studio/cms/members' },
  { label: 'Groups', href: '/studio/cms/groups' },
  { label: 'Progress', href: '/studio/cms/progress' },
  { label: 'Attendance', href: '/studio/cms/attendance' },
  { label: 'Giving', href: '/studio/cms/giving' },
  { label: 'New Members', href: '/studio/cms/new-members' },
  { label: 'Services', href: '/studio/cms/services' },
  { label: 'Reports', href: '/studio/cms/reports' },
];

export default function CMSDashboardLayout({ children }) {
  const router = useRouter();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">📡 CMS Admin Dashboard</h1>
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href}>
            <span
              className={\`px-4 py-2 rounded cursor-pointer text-sm font-medium 
              \${router.pathname === tab.href 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700'}\`}
            >
              {tab.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        {children}
      </div>
    </div>
  );
}
