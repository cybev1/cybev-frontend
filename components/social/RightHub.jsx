import React from 'react';

export default function RightHub() {
  return (
    <aside className="hidden lg:block w-60 p-4 space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">Followers/Friends List</div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">Suggested Events</div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">Marketplace / Jobs</div>
    </aside>
  );
}
