import React, { useState } from 'react';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import LiveNowStrip from '../components/social/LiveNowStrip';
import NewsTicker from '../components/social/NewsTicker';
import PinPostCard from '../components/social/PinPostCard';
import SuperBloggerBadge from '../components/social/SuperBloggerBadge';
import PostComposer from '../components/social/PostComposer';
import PostCard from '../components/social/PostCard';
import AdCard from '../components/social/AdCard';
import SuggestionCard from '../components/social/SuggestionCard';
import RightHub from '../components/social/RightHub';

export default function Feed() {
  const [feed] = useState([{ id: 1, title: 'Hello World' }]);
  const [liveStream] = useState(true);

  return (
    <div className="flex">
      <LeftNav />
      <div className="flex-1 p-4 space-y-4">
        <GreetingWeatherStrip />
        <StoriesCarousel />
        {liveStream && <LiveNowStrip />}
        <NewsTicker />
        <PinPostCard />
        <SuperBloggerBadge />
        <PostComposer />
        {feed.map(post => <PostCard key={post.id} post={post} />)}
        <AdCard />
        <SuggestionCard suggestion={{ title: 'People You May Know' }} />
      </div>
      <RightHub />
    </div>
  );
}
