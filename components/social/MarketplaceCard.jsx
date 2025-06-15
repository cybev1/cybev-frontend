import React from 'react';

export default function MarketplaceCard() {
  return (
    <div className="p-4 bg-green-100 dark:bg-green-800 rounded shadow">
      <h4 className="font-bold mb-2 text-green-900 dark:text-green-100">🛍️ Marketplace Deals</h4>
      <div className="text-sm text-gray-800 dark:text-gray-200 mb-2">
        NFT Artwork – 12 CYBV <br />
        AI Writing Tool – 4.5 CYBV
      </div>
      <button className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Visit Market</button>
    </div>
  );
}