import React, { useEffect, useState } from 'react';
import LeftNav from '@/components/social/LeftNav';
import GreetingWeatherStrip from '@/components/social/GreetingWeatherStrip';
import StoriesCarousel from '@/components/social/StoriesCarousel';
import PostComposer from '@/components/social/PostComposer';
import PostCard from '@/components/social/PostCard';
import RightHub from '@/components/social/RightHub';
import CreateMenu from '@/components/social/CreateMenu';
import CyBevBot from '@/components/social/CyBevBot';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [streamStatus, setStreamStatus] = useState({});
  const [earnings, setEarnings] = useState({ amount: 0 });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/feed')
      .then(res => res.json())
      .then(data => setPosts(data));

    fetch('/api/stories')
      .then(res => res.json())
      .then(data => setStories(data));

    fetch('/api/stream-status')
      .then(res => res.json())
      .then(data => setStreamStatus(data));

    fetch('/api/earnings')
      .then(res => res.json())
      .then(data => setEarnings(data));

    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  const handlePost = (text) => {
    // You can POST to /api/posts here
    console.log('Posting:', text);
  };

  return (
    <div className="flex">
      <LeftNav />
      <main className="flex-1 px-4">
        <GreetingWeatherStrip 
          greeting="Good morning, Prince — Today is a great day!"
          weather={{ temp: 72, icon: '☀️' }}
        />
        <StoriesCarousel stories={stories} streamStatus={streamStatus} />
        <PostComposer onPost={handlePost} />
        <div>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      </main>
      <RightHub notifications={notifications} earnings={earnings} />
      <CreateMenu />
      <CyBevBot />
    </div>
);
}
