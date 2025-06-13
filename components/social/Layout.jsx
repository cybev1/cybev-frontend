import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar */}
      <aside className="w-60 bg-white dark:bg-gray-800 p-4 overflow-auto hidden lg:block">
        <div className="mb-6">
          <Link href="/">
            <a className="text-2xl font-bold text-blue-600 dark:text-white">CYBEV</a>
          </Link>
        </div>
        <nav className="space-y-2">
          <Link href="/feed">
            <a className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
              <span>Home</span>
            </a>
          </Link>
          <Link href="/explore">
            <a className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
              <span>Explore</span>
            </a>
          </Link>
          <Link href="/studio/stories">
            <a className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
              <span>Stories</span>
            </a>
          </Link>
          <Link href="/studio">
            <a className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
              <span>Studio</span>
            </a>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-sm backdrop-blur-md fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center space-x-6">
            <div className="text-xl font-bold text-blue-700 dark:text-white">CYBEV</div>
            <div className="hidden md:flex gap-5 items-center text-sm font-medium">
              <Link href="/features"><a className="text-gray-700 dark:text-white hover:text-blue-600">Features</a></Link>
              <Link href="/setup"><a className="text-gray-700 dark:text-white hover:text-blue-600">Create a Blog</a></Link>
              <Link href="/timeline"><a className="text-gray-700 dark:text-white hover:text-blue-600">Timeline</a></Link>
              <Link href="/explore"><a className="text-gray-700 dark:text-white hover:text-blue-600">Explore</a></Link>
              <Link href="/about"><a className="text-gray-700 dark:text-white hover:text-blue-600">About Us</a></Link>
              <Link href="/contact"><a className="text-gray-700 dark:text-white hover:text-blue-600">Contact</a></Link>
              <Link href="/register"><a className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Get Started</a></Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme}>
              {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
            </button>
            <div className="relative">
              <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full text-white flex items-center justify-center">
                P
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-20 lg:pl-0 lg:pt-20 overflow-auto">{children}</main>
      </div>
    </div>
);
}
