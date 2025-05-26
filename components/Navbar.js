import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useLogout from '../utils/useLogout'; // ✅ NEW

export default function Navbar() {
  const router = useRouter();
  const logout = useLogout(); // ✅ Initialize logout function
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const isActive = (path) =>
    router.pathname === path ? 'text-blue-700 font-semibold' : 'text-gray-700';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 onClick={() => router.push('/')} className="text-xl font-bold text-blue-800 cursor-pointer">
          CYBEV.IO
        </h1>
        <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
          ☰
        </button>
        <ul className="hidden md:flex space-x-4 text-sm font-medium items-center">
          <li><a href="/features" className={isActive('/features')}>Features</a></li>
          <li><a href="/explore" className={isActive('/explore')}>Explore</a></li>
          {user ? (
            <>
              <li><a href="/dashboard" className={isActive('/dashboard')}>Dashboard</a></li>
              <li><button onClick={logout} className="text-red-600 hover:underline">Logout</button></li>
            </>
          ) : (
            <>
              <li><a href="/login" className={isActive('/login')}>Login</a></li>
              <li><a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Get Started</a></li>
            </>
          )}
        </ul>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2 text-sm font-medium">
          <a href="/features" className={isActive('/features')}>Features</a>
          <a href="/explore" className={isActive('/explore')}>Explore</a>
          {user ? (
            <>
              <a href="/dashboard" className={isActive('/dashboard')}>Dashboard</a>
              <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <a href="/login" className={isActive('/login')}>Login</a>
              <a href="/register" className="text-blue-600 hover:underline">Get Started</a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
