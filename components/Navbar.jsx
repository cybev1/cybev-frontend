import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('cybev_username');
    setUsername(storedName || '');
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex items-center justify-between fixed w-full top-0 z-50">
      <Link href="/" className="text-xl font-bold text-blue-600 dark:text-white">
        CYBEV
      </Link>
      <div className="flex items-center space-x-6">
        <Link href="/studio/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">Dashboard</Link>
        <Link href="/studio/blogs" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">Blogs</Link>
        <Link href="/studio/create" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">Post</Link>
        {username ? (
          <div className="text-sm text-gray-800 dark:text-white">👤 {username}</div>
        ) : (
          <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        )}
      </div>
    </nav>
    );
}
