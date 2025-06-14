import React from 'react';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import PinPostCard from '../components/social/PinPostCard';
import SuperBloggerCard from '../components/social/SuperBloggerCard';
import PostComposer from '../components/social/PostComposer';
import PostCard from '../components/social/PostCard';
import AdCard from '../components/social/AdCard';
import SuggestionCard from '../components/social/SuggestionCard';
import LiveNowStrip from '../components/social/LiveNowStrip';
import NewsTicker from '../components/social/NewsTicker';
import FollowersList from '../components/social/FollowersList';
import SuggestedFollowers from '../components/social/SuggestedFollowers';
import GroupsList from '../components/social/GroupsList';
import SuggestedEvents from '../components/social/SuggestedEvents';
import CyBevBot from '../components/social/CyBevBot';

const mockPosts = Array.from({ length: 15 }, (_, i) => ({ id: i, content: `This is post #${i + 1}` }));

export default function Feed() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Navigation */}
      <div className="hidden lg:block w-60 border-r bg-white dark:bg-gray-800">
        <LeftNav />
      </div>

      {/* Center Feed */}
      <div className="flex-1 overflow-auto p-4">
        <GreetingWeatherStrip
          greeting="Good morning Prince"
          motivational="Today is a great day and you are winning!"
          weather={{ temp: 72, icon: '☀️' }}
        />
        <StoriesCarousel />
        <PinPostCard />
        <SuperBloggerCard />
        <PostComposer />

        {mockPosts.map((post, idx) => (
          <React.Fragment key={post.id}>
            {idx === 2 && <AdCard />}
            {idx === 5 && <LiveNowStrip />}
            {idx === 8 && <NewsTicker />}
            {idx === 10 && <SuggestionCard />}
            <PostCard />
          </React.Fragment>
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:block w-80 border-l p-4 bg-white dark:bg-gray-800 overflow-auto">
        <FollowersList />
        <SuggestedFollowers />
        <GroupsList />
        <SuggestedEvents />
      </div>

      <CyBevBot />
    </div>
  );
}
