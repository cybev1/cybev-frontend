// components/social/RightHub.jsx
import React from 'react';
import FollowersList from './FollowersList';
import SuggestedFollowers from './SuggestedFollowers';
import FollowedPages from './FollowedPages';
import GroupsList from './GroupsList';
import SuggestedEvents from './SuggestedEvents';
import MarketplaceLinks from './MarketplaceLinks';
import UtilitiesWidget from './UtilitiesWidget';
import CybeBot from './CybeBot';

/**
 * Contextual sidebar on the right
 */
export default function RightHub({ data }) {
  return (
    <aside className="w-80 hidden lg:block space-y-4 pl-4">
      <FollowersList followers={data.followers} />
      <SuggestedFollowers suggestions={data.suggestions} />
      <FollowedPages pages={data.pages} />
      <GroupsList groups={data.groups} />
      <SuggestedEvents events={data.events} />
      <MarketplaceLinks />
      <UtilitiesWidget />
      <CybeBot />
    </aside>
  );
}
