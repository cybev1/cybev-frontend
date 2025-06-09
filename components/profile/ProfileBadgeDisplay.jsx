import React from 'react';

const BADGE_IMAGES = {
  bronze: 'https://cdn.cybev.io/badges/bronze.png',
  silver: 'https://cdn.cybev.io/badges/silver.png',
  gold: 'https://cdn.cybev.io/badges/gold.png',
  diamond: 'https://cdn.cybev.io/badges/diamond.png'
};

export default function ProfileBadgeDisplay({ badgeTier }) {
  if (!badgeTier || !BADGE_IMAGES[badgeTier]) return null;

  const label = badgeTier.charAt(0).toUpperCase() + badgeTier.slice(1);

  return (
    <div className="flex items-center mt-3">
      <img
        src={BADGE_IMAGES[badgeTier]}
        alt={`${label} Badge`}
        className="h-10 w-10 rounded-full shadow mr-2"
        title={`${label} Badge - Earned via staking`}
      />
      <span className="text-sm font-medium text-gray-700">{label} Badge</span>
    </div>
  );
}