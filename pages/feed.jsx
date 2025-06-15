import React, { useEffect, useState } from 'react';
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
  const [greeting, setGreeting] = useState('');
  const [message, setMessage] = useState('');
  const [weather, setWeather] = useState({ temp: 72, icon: '☀️' });
  const [stories, setStories] = useState([]);
  const [liveStream, setLiveStream] = useState(null);
  const [headlines, setHeadlines] = useState([]);
  const [pinnedPost, setPinnedPost] = useState({ title: 'Welcome to CYBEV!', id: 'pin1' });
  const [feed, setFeed] = useState([]);
  const [rightData, setRightData] = useState({
    followers: [{id:'u1', name:'Alice'}, {id:'u2', name:'Bob'}],
    suggestions: [{id:'u3', name:'Charlie'}],
    pages: [{id:'p1', name:'Tech News'}],
    groups: [{id:'g1', name:'Developers'}],
    events: [{id:'e1', title:'Launch Party'}]
  });

  useEffect(() => {
    const hour = new Date().getHours();
    let greet = 'Hello';
    if (hour < 12) greet = 'Good morning';
    else if (hour < 18) greet = 'Good afternoon';
    else greet = 'Good evening';
    setGreeting(`${greet}, Prince`);
    setMessage('Today is a great day and you are winning!');

    setStories([
      { id: 'upload', userName: 'Your Story', avatar: null },
      { id: 'u1', userName: 'Alice', avatar: '/default-avatar.png' }
    ]);
    setLiveStream({ id: 'admin', title: 'Admin Live Show' });
    setHeadlines(['Breaking: New Feature!', 'Market Update: CYBV Up 5%']);
    setFeed([
      { id:'1', avatar:'/default-avatar.png', userName:'Alice', time:'1h', content:'Hello world!', likes:5, comments:2, shares:1 },
      { id:'2', avatar:'/default-avatar.png', userName:'Bob', time:'2h', content:'Second mock post', likes:3, comments:0, shares:0 }
    ]);
  }, []);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <LeftNav />
      <main className="flex-1 p-4 space-y-6">
        <GreetingWeatherStrip greeting={greeting} message={message} weather={weather} />
        <StoriesCarousel stories={stories} />
        {liveStream && <LiveNowStrip stream={liveStream} />}
        <NewsTicker headlines={headlines} />
        <PinPostCard post={pinnedPost} />
        <SuperBloggerBadge />
        <PostComposer />
        {feed.map(post => <PostCard key={post.id} post={post} />)}
        <AdCard />
        <SuggestionCard suggestion={{ title: 'People You May Know' }} />
      </main>
      <RightHub data={rightData} />
    </div>
);
}
