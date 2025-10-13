import React from 'react';
import PostCard from '../../components/PostCard';
import RightSidebarCards from '../../components/RightSidebarCards';

const samplePosts = [
  {
    id: '1',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    username: 'web3fan',
    timeAgo: '2h ago',
    content: 'Just minted my first NFT on CYBEV! Loving the experience 🚀',
    image: 'https://source.unsplash.com/random/400x200?crypto'
  },
  {
    id: '2',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    username: 'blockbuilder',
    timeAgo: '5h ago',
    content: 'Exploring decentralized social media on CYBEV.',
    image: null
  }
];

export default function Feed() {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <main className="lg:w-3/4 p-4">
        {samplePosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>
      <RightSidebarCards />
    </div>
  );
}
