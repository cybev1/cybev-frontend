import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from './PostCard';

export default function InfiniteFeed({ posts }) {
  const [items, setItems] = useState(posts.slice(0, 5));

  const fetchMore = () => {
    const next = posts.slice(items.length, items.length + 5);
    setItems(prev => [...prev, ...next]);
  };

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMore}
      hasMore={items.length < posts.length}
      loader={<h4 className="text-center my-4">Loading more posts...</h4>}
    >
      {items.map(post => <PostCard key={post.id} post={post} />)}
    </InfiniteScroll>
  );
}