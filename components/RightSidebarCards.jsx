import React from 'react';

export default function RightSidebarCards() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md space-y-4">
      <div>
        <h4 className="font-bold">Suggested</h4>
        <p className="text-sm text-gray-500">Explore new content and creators</p>
      </div>
      <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
      <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
    </div>
  );
}