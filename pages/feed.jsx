// pages/feed.jsx
import { useState, useEffect } from 'react';

export default function Feed() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetch('/api/posts/feed')
      .then(res => res.json())
      .then(data => setFeed(data))
      .catch(console.error);
  }, []);

  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Social Feed</h1>
      {feed.map(post => (
        <div key={post.id} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{post.content}</p>
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>{new Date(post.createdAt).toLocaleString()}</div>
            <div>{post.likes} Likes • {post.shares} Shares • {post.commentsCount} Comments</div>
            <div>Earnings: {post.earnings} CYBV</div>
          </div>
        </div>
      ))}
    </main>
);
}
