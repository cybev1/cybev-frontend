import React from 'react';

export default function SponsoredAd() {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg shadow mb-4 text-center">
      <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">Sponsored</p>
      <img src="/promo-banner.jpg" alt="Ad" className="w-full h-40 object-cover rounded mt-2 mb-2" />
      <p className="text-gray-800 dark:text-gray-200 text-sm mb-2">Promote your brand on CYBEV today. Reach thousands of engaged users instantly.</p>
      <button className="px-4 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Advertise Now</button>
    </div>
  );
}