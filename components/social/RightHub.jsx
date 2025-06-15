import React from 'react';

export default function RightHub() {
  return (
    <aside className="hidden lg:block w-72 p-4 space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h4 className="font-semibold mb-2">People You May Know</h4>
        {/* Placeholder list */}
        <ul className="space-y-2">
          <li className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span>Friend A</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span>Friend B</span>
          </li>
        </ul>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h4 className="font-semibold mb-2">Events & Groups</h4>
        {/* Placeholder cards */}
        <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events.</p>
      </div>
    </aside>