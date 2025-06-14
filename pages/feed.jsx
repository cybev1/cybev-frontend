import React from 'react';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';

export default function Feed() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Navigation */}
      <LeftNav />

      {/* Center Feed */}
      <div className="flex-1 flex flex-col pt-20 lg:pl-0 lg:pt-20 overflow-auto p-4">
        <GreetingWeatherStrip />
        <StoriesCarousel />
        {/* Center Feed placeholder */}
      </div>

      {/* Right Hub */}
      <div className="w-1/4 hidden lg:block bg-white dark:bg-gray-800 p-4 overflow-auto">
        {/* Right Hub placeholder */}
      </div>
    </div>
  );
}
