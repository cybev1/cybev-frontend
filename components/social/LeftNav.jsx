import React from 'react';

/**
 * LeftNav for primary navigation and quick actions
 */
export default function LeftNav() {
  return (
    <aside className="w-60 bg-white dark:bg-gray-800 p-4 hidden lg:block">
      {/* Logo and Search */}
      <div className="mb-6">
        <div className="text-2xl font-bold text-blue-600 dark:text-white">CYBEV</div>
      </div>
      <input type="text" placeholder="Search CYBEV" className="w-full p-2 mb-4 border rounded" />
      {/* Primary Links */}
      <nav className="space-y-2">
        <a href="/feed" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Home</a>
        <a href="/timeline" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Timeline</a>
        <a href="/explore" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Explore</a>
        <a href="/studio/stories" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Stories</a>
        <a href="/studio" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Studio</a>
      </nav>
      {/* Quick Actions */}
      <div className="mt-6">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">Create ▾</button>
        <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg">Go Live</button>
      </div>
    </aside>
