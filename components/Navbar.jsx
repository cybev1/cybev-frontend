
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  return (
    <nav className="w-full px-6 py-4 bg-white dark:bg-black shadow-md flex justify-between items-center">
      <Link href="/">
        <span className="text-xl font-bold text-blue-600">CYBEV.IO</span>
      </Link>

      <div className="flex items-center gap-4">
        {loading ? (
          <span className="text-gray-500 text-sm">Loading...</span>
        ) : user ? (
          <>
            <span className="text-sm font-medium">{user.name}</span>
            <img
              src={user.avatar || '/default-avatar.png'}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
            />
          </>
        ) : (
          <Link href="/login">
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
