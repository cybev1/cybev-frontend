import React from 'react';

/** Quick links for marketplace, jobs, games */
export default function MarketplaceLinks() {
  const links = ['Marketplace', 'Jobs', 'Games'];
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 mb-4">
      <h3 className="font-semibold mb-2">Explore</h3>
      <div className="space-y-2">
        {links.map(l => <a key={l} href="#" className="block hover:underline">{l}</a>)}
      </div>
    </div>
  );
}
