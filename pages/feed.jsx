import React, { useEffect, useState } from 'react';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import PinPostCard from '../components/social/PinPostCard';
import SuperBloggerBadge from '../components/social/SuperBloggerBadge';
import PostComposer from '../components/social/PostComposer';
import LiveNowStrip from '../components/social/LiveNowStrip';
import NewsTicker from '../components/social/NewsTicker';
import PostCard from '../components/social/PostCard';
import AdCard from '../components/social/AdCard';
import SuggestionCard from '../components/social/SuggestionCard';
import RightHub from '../components/social/RightHub';

export default function Feed() {
  const [stories] = useState([{}, {}, {}, {}]);
  const [pinnedPost] = useState({ title: 'This is a pinned post' });
  const [liveStream] = useState({ title: 'Admin is live streaming!' });
  const [headlines] = useState(['Headline 1', 'Headline 2', 'Headline 3']);
  const [feed] = useState([
    { id: 1, author: 'Alice', time: '2h ago', content: 'Hello world!', likes: 10, comments: 2, shares: 1, views: 15 },
    { id: 2, author: 'Bob', time: '3h ago', content: 'Another post', likes: 5, comments: 1, shares: 0, views: 10 },
  ]);
  const [rightData] = useState({});

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <LeftNav />
      <main className="flex-1 overflow-auto p-4">
        <GreetingWeatherStrip />
        <StoriesCarousel stories={stories} />
        <LiveNowStrip stream={liveStream} />
        <NewsTicker headlines={headlines} />
        <PinPostCard post={pinnedPost} />
        <SuperBloggerBadge />
        <PostComposer />
        {feed.map((post) => <PostCard key={post.id} post={post} />)}
        <AdCard />
        <SuggestionCard suggestion={{ title: 'People You May Know' }} />
      </main>
      <RightHub data={rightData} />
    </div>
  );
}