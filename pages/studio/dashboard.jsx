
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [username, setUsername] = useState('Creator');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem('cybev_username') || 'Creator';
    setUsername(name);

    // Simulate stats fetch
    setStats({
      posts: 12,
      views: 12345,
      earnings: 482.75,
      followers: 342
    });
  }, []);

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6 animate-pulse">👋 Welcome back, {username}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-5 rounded-2xl shadow-xl transition hover:scale-105 duration-300">
          <h2 className="text-sm text-blue-200">Total Posts</h2>
          <p className="text-3xl font-extrabold">{stats?.posts || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-900 to-purple-700 p-5 rounded-2xl shadow-xl transition hover:scale-105 duration-300">
          <h2 className="text-sm text-purple-200">Views</h2>
          <p className="text-3xl font-extrabold">{stats?.views?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-green-900 to-green-700 p-5 rounded-2xl shadow-xl transition hover:scale-105 duration-300">
          <h2 className="text-sm text-green-200">Earnings</h2>
          <p className="text-3xl font-extrabold">₿ {stats?.earnings?.toFixed(2) || '0.00'} CYBV</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-900 to-yellow-700 p-5 rounded-2xl shadow-xl transition hover:scale-105 duration-300">
          <h2 className="text-sm text-yellow-200">Followers</h2>
          <p className="text-3xl font-extrabold">{stats?.followers || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href="/studio/create">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-white">📝 Write a Post</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Start creating new content now.</p>
          </div>
        </Link>
        <Link href="/studio/blogs">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-green-50 dark:hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-semibold text-green-800 dark:text-white">📚 Manage Blogs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">View and edit your blogs.</p>
          </div>
        </Link>
        <Link href="/studio/leaderboard">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-yellow-50 dark:hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-white">🏆 Leaderboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">See who’s ranking highest today.</p>
          </div>
        </Link>
      </div>

      <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-2 text-white">🧠 AI Summary (Mock)</h2>
        <p className="text-sm text-gray-300">
          This week, your content reached over <strong>{stats?.views?.toLocaleString() || 0}</strong> viewers,
          earning <strong>₿ {stats?.earnings?.toFixed(2) || '0.00'} CYBV</strong>. Keep posting to climb the leaderboard!
        </p>
      </div>
    </div>
  );
}
