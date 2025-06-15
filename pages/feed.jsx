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

// Mock data
const mockStories = [{ id: 1, title: 'Your Story' }, { id: 2, title: 'Friend Story' }];
const mockFeedPosts = [
  { id: 1, author: 'Alice', content: 'Hello world!' },
  { id: 2, author: 'Bob', content: 'Another post.' }
];
const rightHubData = {
  friends: ['Alice', 'Bob'],
  suggested: ['Charlie', 'Dana']
};

export default function Feed() {
  const [greeting] = useState('Good morning, Prince');
  const [message] = useState('Today is a great day!');
  const [weather] = useState({ temp: 72, icon: '☀️' });
  const [stories] = useState(mockStories);
  const [liveStream] = useState({ title: 'Admin Live', streamer: 'Admin' });
  const [headlines] = useState(['Breaking: CYBEV Launches New Feed!']);
  const [pinnedPost] = useState({ id: 0, author: 'Admin', content: 'Welcome to CYBEV!' });
  const [feed] = useState(mockFeedPosts);
  const [rightData] = useState(rightHubData);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <LeftNav />
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <GreetingWeatherStrip greeting={greeting} message={message} weather={weather} />
        <StoriesCarousel stories={stories} />
        <LiveNowStrip stream={liveStream} />
        <NewsTicker headlines={headlines} />
        <PinPostCard post={pinnedPost} />
        <SuperBloggerBadge />
        <PostComposer />
        {feed.map(post => <PostCard key={post.id} post={post} />)}
        <AdCard />
        <SuggestionCard suggestion={{ title: 'People You May Know' }} />
      </div>
      <RightHub data={rightData} />
    </div>
);
}
