
import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function Navbar({ theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md shadow-sm fixed top-0 z-50 transition-colors duration-500">
      <div className="text-2xl font-bold text-blue-700 dark:text-white">CYBEV.IO</div>

      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 dark:text-gray-300">
          {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      <div className="hidden md:flex space-x-6 items-center">
        <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white font-medium transition">Features</Link>
        <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white font-medium transition">Explore</Link>
        <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Get Started</Link>
        <button onClick={toggleTheme} className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:scale-110 transition">
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 flex flex-col items-center space-y-4 py-6 md:hidden shadow-md transition-all duration-300">
          <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white font-medium transition" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white font-medium transition" onClick={() => setMenuOpen(false)}>Explore</Link>
          <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition" onClick={() => setMenuOpen(false)}>Get Started</Link>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:scale-110 transition">
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
        </div>
      )}
    </nav>
  );
}
