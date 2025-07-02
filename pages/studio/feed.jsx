
import React from 'react';
import PostCard from '../components/PostCard';
import RightSidebarCards from '../components/RightSidebarCards';

const dummyPosts = [
  { id: 1, title: "Hello CYBEV!", content: "Welcome to the new platform!" },
  { id: 2, title: "Web3 Revolution", content: "Mint, stake, and earn!" }
];

export default function Feed() {
  return (
    <div className="flex">
      <div className="w-2/3 p-6">
        {dummyPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div className="w-1/3 p-6">
        <RightSidebarCards />
      </div>
    </div>
  );
}
