
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 flex justify-between items-center px-6 py-4 shadow-sm backdrop-blur-md bg-white/70 dark:bg-black/70">
        <div className="text-xl font-bold text-blue-700 dark:text-white">CYBEV</div>
        <div className="hidden md:flex gap-5 items-center text-sm font-medium">
          <Link href="/features" className="text-gray-700 dark:text-white hover:text-blue-600">Features</Link>
          <Link href="/setup" className="text-gray-700 dark:text-white hover:text-blue-600">Create a Blog</Link>
          <Link href="/timeline" className="text-gray-700 dark:text-white hover:text-blue-600">Timeline</Link>
          <Link href="/explore" className="text-gray-700 dark:text-white hover:text-blue-600">Explore</Link>
          <Link href="/about" className="text-gray-700 dark:text-white hover:text-blue-600">About Us</Link>
          <Link href="/contact" className="text-gray-700 dark:text-white hover:text-blue-600">Contact</Link>
          <Link href="/register" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Get Started</Link>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
      </nav>
      <main className="pt-32">{children}</main>
    </>
  );
}
