
import React from 'react';

export default function RightSidebarCards() {
  return (
    <aside className="hidden lg:block lg:w-1/4 space-y-4 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Trending</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>#Web3</li>
          <li>#CYBEV</li>
          <li>#NFT</li>
          <li>#AI</li>
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Suggested Users</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>@cybev_admin</li>
          <li>@blockqueen</li>
          <li>@mint_master</li>
        </ul>
      </div>
    </aside>
  );
}
