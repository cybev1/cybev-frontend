import React from 'react';
import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import LiveNowStrip from '../components/social/LiveNowStrip';
import NewsTicker from '../components/social/NewsTicker';
import PinPostCard from '../components/social/PinPostCard';
import PostComposer from '../components/social/PostComposer';
import PostCard from '../components/social/PostCard';
import AdCard from '../components/social/AdCard';
import SuggestionCard from '../components/social/SuggestionCard';
import RightHub from '../components/social/RightHub';

const dummyPosts = [
  {
    id: 1,
    avatar: '/avatars/user1.jpg',
    name: 'Alice Johnson',
    time: '2h ago',
    badge: 'Super Blogger',
    content: 'Check out my latest article on Web3 trends!',
    media: '/media/post1.jpg',
    views: 120,
    likes: 34,
    reactions: [{ emoji: '👍', count: 20 }, { emoji: '❤️', count: 10 }, { emoji: '🔥', count: 5 }],
  },
  {
    id: 2,
    avatar: '/avatars/user2.jpg',
    name: 'Bob Smith',
    time: '5h ago',
    badge: '',
    content: 'Loving the new features on CyBev 🔥',
    media: '',
    views: 89,
    likes: 15,
    reactions: [{ emoji: '👍', count: 12 }, { emoji: '😂', count: 3 }],
  },
  // Add more dummy posts as needed
];

export default function Feed() {
  return (
    <div className="flex">
      <LeftNav />
      <div className="flex-1 p-4 space-y-6">
        <GreetingWeatherStrip />
        <StoriesCarousel />
        <LiveNowStrip />
        <NewsTicker />
        <PinPostCard />
        <PostComposer />
        {dummyPosts.map(post => <PostCard key={post.id} post={post} />)}
        <AdCard />
        <SuggestionCard />
      </div>
      <RightHub />
    </div>
  );
}
