import React from 'react';
import PostCard from '@/components/social/PostCard';
import CyBevBotWidget from '@/components/social/CyBevBotWidget';
import LiveNowStrip from '@/components/social/LiveNowStrip';
import PostComposer from '@/components/social/PostComposer';
import SuperBloggerCard from '@/components/social/SuperBloggerCard';
import SuggestedFollowers from '@/components/social/SuggestedFollowers';
import SponsoredAdCard from '@/components/social/SponsoredAdCard';
import RightSidebarCards from '@/components/social/RightSidebarCards';

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
      userName: 'Michael Smith',
      avatar: '/default-avatar.png',
      time: '1 day ago',
      content: 'Loving the CYBEV platform already!',
      likes: 6,
    },
    {
      id: 4,
      userName: 'Esther Bright',
      avatar: '/default-avatar.png',
      time: '2 days ago',
      content: 'Just minted my first post!',
      likes: 3,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      <div className="flex-1 lg:max-w-2xl mx-auto relative">
        <h1 className="text-2xl font-bold mb-4 text-center">🚀 CYBEV Feed Demo</h1>
        <LiveNowStrip />
        <PostComposer />
        <SuperBloggerCard />

        {dummyPosts.map((post, index) => (
          <React.Fragment key={post.id}>
            <PostCard post={post} />
            {(index + 1) % 3 === 0 && <SponsoredAdCard />}
          </React.Fragment>
        ))}

        <SuggestedFollowers />
        <CyBevBotWidget />
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-full max-w-xs">
        <RightSidebarCards />
      </div>
    </div>
  );
}