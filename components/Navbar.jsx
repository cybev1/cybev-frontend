
import { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Creator', avatar: '/avatar.png' });

  useEffect(() => {
    const name = localStorage.getItem('cybev_username') || 'Creator';
    setUser(prev => ({ ...prev, name }));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 px-6 py-4 shadow-md flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-300">CYBEV</Link>
      <div className="relative">
        <Menu>
          <Menu.Button className="flex items-center space-x-2">
            <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full" />
            <span className="hidden md:inline text-sm font-medium dark:text-white">{user.name}</span>
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
            <Menu.Item>
              {({ active }) => (
                <Link href="/studio/profile" className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>👤 View Profile</Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link href="/studio/settings" className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>⚙️ Settings</Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button onClick={handleLogout} className={`w-full text-left block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>🚪 Logout</button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
}
