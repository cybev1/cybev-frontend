import LeftNav from '../../components/social/LeftNav';
import GreetingWeatherStrip from '../../components/social/GreetingWeatherStrip';
import StoriesCarousel from '../../components/social/StoriesCarousel';
import LiveNowStrip from '../../components/social/LiveNowStrip';
import PostComposer from '../../components/social/PostComposer';
import PostCard from '../../components/social/PostCard';
import RightHub from '../../components/social/RightHub';

export default function FeedPage() {
  const mockPosts = [
    { author: 'Alice', content: 'Hello world!', likes: 5, views: 100 },
    { author: 'Bob', content: 'How is everyone?', likes: 3, views: 75 },
    { author: 'Carol', content: 'React is awesome!', likes: 10, views: 200 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <LeftNav />
      <main className="flex-1 p-4 lg:pl-0">
        <GreetingWeatherStrip />
        <StoriesCarousel />
        <LiveNowStrip />
        <PostComposer />
        {mockPosts.map((post, idx) => (
          <PostCard key={idx} post={post} />
        ))}
      </main>
      <RightHub />
    </div>
);
}
