import React from 'react';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import LiveNowStrip from '../components/social/LiveNowStrip';
import PostComposer from '../components/social/PostComposer';
import RightHub from '../components/social/RightHub';

export default function Feed() {
  const mockWeather = { temp: 72, icon: '☀️' };
  const mockStories = [
    { id: 1, label: 'Your Story', image: '/story1.jpg', isUser: true },
    { id: 2, label: 'Alice', image: '/story2.jpg', isLive: false },
    { id: 3, label: 'Bob', image: '/story3.jpg', isLive: true },
    { id: 4, label: 'Charlie', image: '/story4.jpg', isLive: false },
  ];
  const mockLiveNow = { isLive: true, title: 'Admin Live Now!' };
  const mockFeedPosts = [
    { id: 1, author: 'Alice', time: '2h', content: 'Hello world!', likes: 10, comments: 2, mint: 5, stake: 3 },
    { id: 2, author: 'Bob', time: '1h', content: 'This is a post.', likes: 5, comments: 1, mint: 2, stake: 1 },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <aside className="hidden lg:block w-1/4 border-r overflow-auto">
        <LeftNav />
      </aside>
      <main className="flex-1 overflow-auto p-4">
        <GreetingWeatherStrip weather={mockWeather} />
        <StoriesCarousel stories={mockStories} />
        <LiveNowStrip live={mockLiveNow} />
        <PostComposer />
        {mockFeedPosts.map(post => (
          <div key={post.id} className="mb-4 p-4 border rounded">
            <div className="flex justify-between mb-2">
              <span className="font-bold">{post.author}</span>
              <span className="text-sm text-gray-500">{post.time}</span>
            </div>
            <p className="mb-2">{post.content}</p>
            <div className="flex justify-between text-sm text-gray-600">
              <span>👍 {post.likes}</span>
              <span>💬 {post.comments}</span>
              <span>🪙 Mint: {post.mint}</span>
              <span>📈 Stake: {post.stake}</span>
            </div>
          </div>
        ))}
      </main>
      <aside className="hidden lg:block w-1/4 border-l overflow-auto p-4">
        <RightHub />
      </aside>
    </div>
  );
}
