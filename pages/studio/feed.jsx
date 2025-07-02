import React from 'react';
import PostCard from '@/components/PostCard';
import RightSidebarCards from '@/components/RightSidebarCards';

export default function Feed() {
  return (
    <div className="flex w-full px-4 md:px-12 pt-20 gap-6 bg-gray-50 dark:bg-black min-h-screen">
      <div className="flex flex-col w-full max-w-2xl mx-auto space-y-6">
        {[1, 2, 3].map((id) => (
          <PostCard
            key={id}
            post={{
              id,
              username: "cybev_user",
              content: "This is a sample post on CYBEV!",
              image: "/sample.jpg",
              views: 120 + id,
              reactions: 10 * id,
              earnings: 1.2 * id,
            }}
          />
        ))}
      </div>
      <div className="hidden xl:block w-80">
        <RightSidebarCards />
      </div>
    </div>
  );
}