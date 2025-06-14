import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import LiveNowStrip from '../components/social/LiveNowStrip';
import PinPostCard from '../components/social/PinPostCard';
import SuperBloggerStrip from '../components/social/SuperBloggerStrip';
import PostComposer from '../components/social/PostComposer';
import PostCard from '../components/social/PostCard';
import AdCard from '../components/social/AdCard';
import SuggestionCard from '../components/social/SuggestionCard';
import NewsTicker from '../components/social/NewsTicker';

const fetcher = url => axios.get(url).then(res => res.data);

export default function FeedPage() {
  const { data: feed } = useSWR('/api/posts/feed', fetcher);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <LeftNav />
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <GreetingWeatherStrip />
        <StoriesCarousel />
        <LiveNowStrip />
        <PinPostCard />
        <SuperBloggerStrip />
        <PostComposer />
        {feed ? feed.map((post, idx) => {
          if (idx > 0 && idx % 3 === 0) return <AdCard key={'ad'+idx} />;
          if (idx > 0 && idx % 10 === 0) return <SuggestionCard key={'sug'+idx} />;
          return <PostCard key={post.id} post={post} />;
        }) : <div>Loading feed...</div>}
        <NewsTicker />
      </div>
      <div className="w-80 p-4 hidden lg:block">
        {/* Right Hub placeholder */}
      </div>
    </div>
}