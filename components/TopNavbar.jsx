import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopNavbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
      <Link href="/studio/dashboard">
        <span className="text-xl font-bold text-blue-600 dark:text-blue-300">CYBEV</span>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700 dark:text-gray-200">👤 {user.name}</span>
            <img src={user.photo || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full" />
          </>
        ) : (
          <Link href="/login" className="text-sm text-blue-600">Login</Link>
        )}
      </div>
    </div>
  );
}