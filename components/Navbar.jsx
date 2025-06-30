
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('cybev_token');
    if (token) {
      fetch('https://api.cybev.io/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cybev_token');
    router.push('/login');
  };

  return (
    <nav className="w-full px-6 py-4 bg-white dark:bg-black shadow flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600 dark:text-white">CYBEV</Link>
      <div className="relative" ref={dropdownRef}>
        {user ? (
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            <img src={`https://robohash.org/${user.name}.png?size=40x40`} className="w-10 h-10 rounded-full border" />
            <span className="hidden md:inline text-sm">{user.name}</span>
          </button>
        ) : (
          <Link href="/login" className="text-blue-500 text-sm">Login</Link>
        )}

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-md z-50">
            <Link href="/studio/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">👤 View Profile</Link>
            <Link href="/studio/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">⚙️ Settings</Link>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-600 text-red-600 dark:text-red-300">🚪 Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
