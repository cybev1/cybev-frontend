import React, { useEffect, useState, useRef } from 'react';
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchData(1);
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => setStories(data));
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchData(page + 1);
      }
    }, { rootMargin: '100px' });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef.current, hasMore, page]);

  const fetchData = nextPage => {
    fetch(`/api/feed?page=${nextPage}`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setPosts(prev => [...prev, ...data]);
          setPage(nextPage);
        }
      });
  };

  const handlePost = text => {
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
        <StoriesCarousel stories={stories} />
        <PostComposer onPost={handlePost} />
        <div>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
          {hasMore && (
            <div ref={loaderRef} className="p-4 text-center text-gray-500">
              Loading more posts...
            </div>
          )}
        </div>
      </main>
      <RightHub notifications={[]} earnings={{ amount: 0 }} />
      <CreateMenu />
      <CyBevBot />
    </div>
);
}
