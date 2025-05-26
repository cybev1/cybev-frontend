import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1
          onClick={() => router.push('/')}
          className="text-xl font-bold text-blue-800 cursor-pointer"
        >
          CYBEV.IO
        </h1>
        <ul className="flex space-x-4 text-sm font-medium text-gray-700 items-center">
          <li><a href="/features" className="hover:text-blue-600">Features</a></li>
          <li><a href="/explore" className="hover:text-blue-600">Explore</a></li>
          {user ? (
            <>
              <li><a href="/dashboard" className="hover:text-blue-600">Dashboard</a></li>
              <li><button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button></li>
            </>
          ) : (
            <>
              <li><a href="/login" className="hover:text-blue-600">Login</a></li>
              <li><a href="/register" className="hover:text-blue-600">Get Started</a></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}