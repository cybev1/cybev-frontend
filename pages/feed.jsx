import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/solid';

const mockStories = [
  { id: 'upload', type: 'upload' },
  { id: 1, userName: 'Alice', avatar: '/default-avatar.png' },
  { id: 2, userName: 'Bob', avatar: '/default-avatar.png' },
  { id: 3, userName: 'Charlie', avatar: '/default-avatar.png' },
  { id: 4, userName: 'Diana', avatar: '/default-avatar.png' }
];

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [greeting, setGreeting] = useState('');
  const [message, setMessage] = useState('');
  const firstName = 'Prince';

  useEffect(() => {
    const hour = new Date().getHours();
    let greet = 'Hello';
    if (hour < 12) greet = 'Good morning';
    else if (hour < 18) greet = 'Good afternoon';
    else greet = 'Good evening';
    setGreeting(`${greet}, ${firstName}`);

    const msgs = [
      'Today is a great day and you are winning!',
      'Keep pushing forward—you’ve got this!',
      'Your hard work is paying off. Stay motivated!',
      'Believe in yourself and magic will happen!',
      'Stay focused and never give up!'
    ];
    setMessage(msgs[new Date().getDate() % msgs.length]);
  }, []);

  const fetchFeed = () => {
    fetch(`/api/posts/feed?page=${page}&limit=10`)
      .then(res => res.json())
      .then(data => {
        if (data.length < 10) setHasMore(false);
        setFeed(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      {/* Greeting */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{greeting}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>

      {/* Stories Carousel */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 overflow-x-auto whitespace-nowrap">
        <div className="flex space-x-4">
          {mockStories.map(story => (
            <motion.div
              key={story.id}
              className="inline-block text-center"
              whileHover={{ scale: 1.05 }}
            >
              {story.type === 'upload' ? (
                <div className="w-20 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center cursor-pointer">
                  <PlusIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
              ) : (
                <div className="w-20 h-32 rounded-xl overflow-hidden border-2 border-blue-500 p-1 cursor-pointer">
                  <img src={story.avatar} alt={story.userName} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">
                {story.type === 'upload' ? 'Your Story' : story.userName}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Post Box */}
      <motion.div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-text">
          What's on your mind today?
        </div>
      </motion.div>

      {/* Feed posts */}
      <InfiniteScroll
        dataLength={feed.length}
        next={fetchFeed}
        hasMore={hasMore}
        loader={<h4 className="text-center py-4">Loading...</h4>}
      >
        {feed.map(post => (
          <div
            key={post.id}
            className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform hover:-translate-y-1 transition"
          >
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>👍 {post.likes}</span>
              <span>💬 {post.commentsCount}</span>
              <span>🔁 {post.shares}</span>
              <span>🚀 Boost</span>
              <span>💰 Tip</span>
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              Earned: {post.earnings} CYBV
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
