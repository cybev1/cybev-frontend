
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png');
  const dropdownRef = useRef();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const user = localStorage.getItem('cybev_username') || 'Creator';
    const avatar = localStorage.getItem('cybev_avatar') || '/default-avatar.png';
    setUsername(user);
    setAvatarUrl(avatar);

    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
      <Link href="/studio/dashboard" className="text-lg font-bold text-blue-600 dark:text-blue-300">
        CYBEV STUDIO
      </Link>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-300" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
        </button>

        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button>
            <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-gray-400 dark:border-gray-600" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <Menu.Item>
              {({ active }) => (
                <button onClick={() => router.push('/studio/profile')} className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } block w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white`}>
                  👤 View Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button onClick={() => router.push('/studio/settings')} className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } block w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white`}>
                  ⚙️ Settings
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button onClick={logout} className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } block w-full text-left px-4 py-2 text-sm text-red-600`}>
                  🚪 Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </nav>
  );
}
