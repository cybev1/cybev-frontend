
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const stats = {
    posts: 12,
    views: 12345,
    earnings: 482.75,
    followers: 342
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">👋 Welcome, {user?.name || 'Creator'}</h1>
        {user && (
          <div className="flex items-center gap-3">
            <Image src={user?.photo || '/avatar.png'} alt="Avatar" width={40} height={40} className="rounded-full" />
            <span className="text-sm">{user.email}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Posts</h2>
          <p className="text-2xl font-bold">{stats.posts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Views</h2>
          <p className="text-2xl font-bold">{stats.views.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Earnings</h2>
          <p className="text-2xl font-bold">₿ {stats.earnings.toFixed(2)} CYBV</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Followers</h2>
          <p className="text-2xl font-bold">{stats.followers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href="/studio/create">
          <div className="bg-blue-100 dark:bg-blue-900 p-5 rounded-xl shadow hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-white">📝 Write a Post</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Start creating new content now.</p>
          </div>
        </Link>
        <Link href="/studio/blogs">
          <div className="bg-green-100 dark:bg-green-900 p-5 rounded-xl shadow hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-semibold text-green-800 dark:text-white">📚 Manage Blogs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">View and edit your blogs.</p>
          </div>
        </Link>
        <Link href="/studio/leaderboard">
          <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-xl shadow hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-white">🏆 Leaderboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">See who’s ranking highest today.</p>
          </div>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">🧠 AI Summary (Mock)</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This week, your content reached over <strong>{stats.views.toLocaleString()}</strong> viewers,
          earning <strong>₿ {stats.earnings.toFixed(2)} CYBV</strong>. Keep posting to climb the leaderboard!
        </p>
      </div>
    </div>
  );
}
