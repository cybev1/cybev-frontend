import LeftNav from '../components/social/LeftNav';
import GreetingWeatherStrip from '../components/social/GreetingWeatherStrip';
import LiveNowStrip from '../components/social/LiveNowStrip';
import StoriesCarousel from '../components/social/StoriesCarousel';
import PostComposer from '../components/social/PostComposer';
import FeedItem from '../components/social/FeedItem';

export default function Feed() {
  const dummyItems = [
    {
      id: 1,
      user: { name: 'Alice', avatar: '/default-avatar.png' },
      timestamp: '2h ago',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      views: 120,
      likes: 34,
      comments: 5,
      reactions: { '👍': 10, '❤️': 5, '😂': 3 },
    },
    {
      id: 2,
      user: { name: 'Bob', avatar: '/default-avatar.png' },
      timestamp: '5h ago',
      content: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
      views: 89,
      likes: 12,
      comments: 2,
      reactions: { '👍': 7, '🎉': 2 },
    },
  ];

  return (
    <div className="flex min-h-screen">
      <LeftNav />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        <GreetingWeatherStrip />
        <LiveNowStrip />
        <StoriesCarousel />
        <PostComposer />
        <div className="space-y-4 mt-4">
          {dummyItems.map(item => (
            <FeedItem key={item.id} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
}
