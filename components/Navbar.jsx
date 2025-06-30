import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import getUserProfile from '@/utils/getUserProfile';
import logout from '@/utils/logout';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getUserProfile()
      .then(setUser)
      .catch(() => logout(router));
  }, []);

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600">CYBEV</Link>
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/studio/dashboard" className="text-sm text-gray-800 dark:text-white">Dashboard</Link>
        {user && (
          <div className="relative group">
            <button className="text-sm font-medium text-gray-700 dark:text-white focus:outline-none">
              👤 {user.name}
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 rounded shadow-md hidden group-hover:block z-50">
              <Link href="/studio/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700">Profile</Link>
              <button
                onClick={() => logout(router)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700 dark:text-white">
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </nav>
  );
}