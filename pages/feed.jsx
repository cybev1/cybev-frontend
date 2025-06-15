import React from 'react';
import PostCard from '@/components/social/PostCard';
import CyBevBotWidget from '@/components/social/CyBevBotWidget';
import LiveNowStrip from '@/components/social/LiveNowStrip';
import PostComposer from '@/components/social/PostComposer';

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
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4 text-center">🚀 CYBEV Feed Demo</h1>

      <LiveNowStrip />
      <PostComposer />

      {dummyPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <CyBevBotWidget />
    </div>
  );
}
