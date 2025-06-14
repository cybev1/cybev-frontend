import React from 'react';
import Link from 'next/link';
import NotificationBell from './NotificationBell';
import TokenBalance from './TokenBalance';

export default function LeftNav() {
  return (
    <aside className="p-4">
      {/* Brand */}
      <Link href="/">
        <a className="text-2xl font-bold text-blue-600 dark:text-white mb-4 block">CYBEV</a>
      </Link>

      {/* User Metrics */}
      <div className="mb-4">
        <TokenBalance />
        <NotificationBell />
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 mb-4">
        <Link href="/feed"><a className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Home</a></Link>
        <Link href="/explore"><a className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Explore</a></Link>
        <Link href="/studio/stories"><a className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Stories</a></Link>
        <Link href="/studio"><a className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Studio</a></Link>
      </nav>

      {/* Quick Actions */}
      <div className="space-y-2">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">Create ▾</button>
        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg">Go Live</button>
      </div>
    </aside>
  );
}
