import React from 'react';

const tiers = ['all', 'bronze', 'silver', 'gold', 'diamond'];

export default function BadgeFilterTabs({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tiers.map((tier) => (
        <button
          key={tier}
          onClick={() => onChange(tier)}
          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${selected === tier
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          {tier === 'all' ? 'All Users' : tier.charAt(0).toUpperCase() + tier.slice(1)}
        </button>
      ))}
    </div>
  );
}