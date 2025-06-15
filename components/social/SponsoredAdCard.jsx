import React from 'react';

export default function SponsoredAdCard() {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 p-4 rounded-lg shadow my-4">
      <div className="font-bold text-yellow-800 dark:text-yellow-100 mb-2">Sponsored</div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Advertise your product or service here on CYBEV. Reach a vibrant community of digital creators.
      </p>
    </div>
  );
}