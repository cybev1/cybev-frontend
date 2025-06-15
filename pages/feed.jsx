import React from 'react';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import ViewsCounter from '../components/social/ViewsCounter';
import ReactionPicker from '../components/social/ReactionPicker';
import TokenActions from '../components/social/TokenActions';

const mockStories = [{name: 'Alice'}, {name: 'Bob'}, {name: 'Carol'}];
const mockPosts = [
  {
    id:1, author:'Alice', content:'Hello world!', views:123, reactions:{}, 
  },
  {id:2, author:'Bob', content:'Second post', views:45, reactions:{}},
];

export default function Feed() {
  const userName = 'Prince';
  const weather = { temp: 72, icon: '☀️' };

  const handleReact = (emoji, postId) => console.log('Reacted', emoji, 'to', postId);
  const handleMint = postId => console.log('Mint on', postId);
  const handleStake = postId => console.log('Stake on', postId);

  return (
    <div className="flex h-screen overflow-hidden">
      <LeftNav />

      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        <GreetingWeatherStrip userName={userName} weather={weather} />
        <StoriesCarousel stories={mockStories} />

        <div className="space-y-4">
          {mockPosts.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <span className="font-semibold">{p.author}</span>
                <ViewsCounter views={p.views} />
              </div>
              <div className="mt-2">{p.content}</div>
              <div className="mt-2 flex items-center space-x-4">
                <ReactionPicker onReact={emoji => handleReact(emoji, p.id)} />
                <TokenActions onMint={() => handleMint(p.id)} onStake={() => handleStake(p.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-64 bg-gray-50 dark:bg-gray-900 p-4">{/* RightHub placeholder */}</div>
    </div>
  );
}
