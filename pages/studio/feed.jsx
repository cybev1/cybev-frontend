import React from 'react';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import LiveNowStrip from '../components/social/LiveNowStrip';
import PostComposer from '../components/social/PostComposer';
import InfiniteFeed from '../components/social/InfiniteFeed';
import RightHub from '../components/social/RightHub';

// Dummy data
const dummyPosts = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  avatar: 'https://via.placeholder.com/40',
  name: 'User ' + (i+1),
  time: `${i+1}h ago`,
  badge: i === 0 ? 'Pinned' : i === 1 ? 'Super Blogger' : '',
  content: 'This is a sample post content for post #' + (i+1),
  image: i % 3 === 0 ? 'https://via.placeholder.com/400x200' : null,
  views: Math.floor(Math.random() * 1000),
  reactions: Math.floor(Math.random() * 100),
}));

export default function Feed() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <LeftNav />
      <main className="flex-1 p-4">
        <GreetingWeatherStrip />
        <StoriesCarousel />
        <LiveNowStrip isLive={true} streamUrl="#" />
        <PostComposer />
        <InfiniteFeed posts={dummyPosts} />
      </main>
      <RightHub />
    </div>
  );
}