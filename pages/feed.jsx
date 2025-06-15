import React from 'react';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import LiveNowStrip from '../components/social/LiveNowStrip';
import PostComposer from '../components/social/PostComposer';
import PostCard from '../components/social/PostCard';
import RightHub from '../components/social/RightHub';

export default function Feed() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <aside className="hidden md:block w-full md:w-1/4 border-r p-4"><LeftNav /></aside>
      <main className="flex-1 overflow-auto p-4 space-y-4">
        <GreetingWeatherStrip />
        <StoriesCarousel />
        <LiveNowStrip />
        <PostComposer />
        {[1,2,3].map(i => <PostCard key={i} />)}
      </main>
      <aside className="hidden lg:block w-full lg:w-1/4 border-l p-4"><RightHub /></aside>
    </div>
  );
}
