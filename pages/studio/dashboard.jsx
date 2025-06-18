
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('cybev_user_token');
    if (!token) {
      router.replace('/auth/login');
    } else {
      setToken(token);
      // Optionally fetch user profile data here
      const username = localStorage.getItem('cybev_username') || 'Creator';
      setUser({ name: username });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">👋 Welcome, {user.name}!</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Your Creator Studio Command Center
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/studio/create">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">📝 Create Post</h2>
              <p className="text-sm text-gray-500">Write and publish a new article or content.</p>
            </div>
          </Link>

          <Link href="/studio/write">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">✍️ Write to Blog</h2>
              <p className="text-sm text-gray-500">Select one of your blogs and write to it.</p>
            </div>
          </Link>

          <Link href="/studio/blogs">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">📚 My Blogs</h2>
              <p className="text-sm text-gray-500">Manage and view all blogs you’ve created.</p>
            </div>
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-bold mb-2">💰 Earnings Overview</h3>
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl">
            <p className="text-lg font-semibold">Token Balance: <span className="text-blue-700 dark:text-blue-300">₿ 0.00 CYBV</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your recent rewards and post earnings will appear here.</p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-bold mb-2">🚀 Quick Links</h3>
          <div className="flex gap-4 flex-wrap">
            <Link href="/studio/analytics">
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">📊 Analytics</button>
            </Link>
            <Link href="/studio/wallet">
              <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">💼 Wallet</button>
            </Link>
            <Link href="/studio/leaderboard">
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">🏆 Leaderboard</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
