
import React from 'react';

export default function SuperBloggerCard() {
  return (
    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg shadow mb-4 flex items-center space-x-3">
      <img src="/default-avatar.png" alt="Jane Smith" className="w-12 h-12 rounded-full" />
      <div>
        <div className="font-semibold text-blue-800 dark:text-white">Jane Smith 🔥</div>
        <div className="text-sm text-blue-700 dark:text-blue-300">Super Blogger</div>
      </div>
    </div>
  );
}
