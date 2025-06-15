import React from 'react';

export default function RightSidebarCards() {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Marketplace</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Browse NFTs, digital goods, and services.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Suggested Events</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Join local and virtual events happening soon.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Quick Links</h2>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
          <li>Memories</li>
          <li>Funding</li>
          <li>Surveys & Petitions</li>
        </ul>
      </div>
    </div>
  );
}