import React from 'react';
import MarketplaceCard from './MarketplaceCard';
import GameCenterCard from './GameCenterCard';
import MemoriesCard from './MemoriesCard';
import GroupTabsCard from './GroupTabsCard';

export default function RightSidebarCards() {
  return (
    <aside className="space-y-4 mt-8 text-sm text-gray-700 dark:text-gray-200">
      <MarketplaceCard />
      <GameCenterCard />
      <MemoriesCard />
      <GroupTabsCard />
    </aside>
  );
}