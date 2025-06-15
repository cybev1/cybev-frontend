import React from 'react';
import PostCard from '@/components/social/PostCard';
import CyBevBotWidget from '@/components/social/CyBevBotWidget';
import LiveNowStrip from '@/components/social/LiveNowStrip';
import PostComposer from '@/components/social/PostComposer';
import SuperBloggerCard from '@/components/social/SuperBloggerCard';
import SuggestedFollowers from '@/components/social/SuggestedFollowers';
import SponsoredAd from '@/components/social/SponsoredAd';

export default function Feed() {
  const dummyPosts = [
    {
      id: 1,
      userName: 'Prince Dike',
      avatar: '/default-avatar.png',
      time: '2 hrs ago',
      content: 'This is a test post with token buttons!',
      likes: 4,
    },
    {
      id: 2,
      userName: 'Jane Doe',
      avatar: '/default-avatar.png',
      time: '5 hrs ago',
      content: 'Another amazing post with emojis 💥🔥',
      likes: 2,
    },
    {
      id: 3,
      userName: 'John Snow',
      avatar: '/default-avatar.png',
      time: '1 day ago',
      content: 'The minting system is live now! 🪙',
      likes: 8,
    },
    {
      id: 4,
      userName: 'Ada Lovelace',
      avatar: '/default-avatar.png',
      time: '2 days ago',
      content: 'CYBEV staking just got upgraded! 📈',
      likes: 5,
    },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4 text-center">🚀 CYBEV Feed Demo</h1>
      <LiveNowStrip />
      <PostComposer />
      <SuperBloggerCard />

      {dummyPosts.map((post, index) => (
        <React.Fragment key={post.id}>
          <PostCard post={post} />
          {(index + 1) % 3 === 0 && <SponsoredAd />}
        </React.Fragment>
      ))}

      <SuggestedFollowers />
      <CyBevBotWidget />
    </div>
  );
}