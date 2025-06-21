import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import RightSidebarWidgets from '@/components/social/RightSidebarWidgets';
import SuggestedFollowers from '@/components/social/SuggestedFollowers';
import LiveNow from '@/components/social/LiveNow';
import TrendingTags from '@/components/social/TrendingTags';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const navLinks = (
    <div className="space-y-2">
      <Link href="/feed"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Home</a></Link>
      <Link href="/timeline"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Timeline</a></Link>
      <Link href="/explore"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Explore</a></Link>
      <Link href="/studio/stories"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Stories</a></Link>
      <Link href="/studio"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Studio</a></Link>
      <Link href="/features"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Features</a></Link>
      <Link href="/setup"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Create a Blog</a></Link>
      <Link href="/about"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">About Us</a></Link>
      <Link href="/contact"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Contact</a></Link>
      <Link href="/auth/register"><a className="block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Get Started</a></Link>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-60 bg-white dark:bg-gray-800 p-4 hidden lg:block overflow-auto">
        <Link href="/">
          <a className="text-2xl font-bold text-blue-600 dark:text-white block mb-6">CYBEV</a>
        </Link>
        <input type="text" placeholder="Search CYBEV" className="w-full p-2 mb-4 border rounded" />
        <nav className="space-y-2">{navLinks}</nav>
        <div className="mt-6">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mb-2">Create ▾</button>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg">Go Live</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 shadow fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <XMarkIcon className="w-6 h-6 text-gray-800 dark:text-gray-200"/> : <Bars3Icon className="w-6 h-6 text-gray-800 dark:text-gray-200"/>}
              </button>
              <Link href="/">
                <a className="text-xl font-bold text-blue-600 dark:text-white">CYBEV</a>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme}>
                {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400"/> : <MoonIcon className="w-5 h-5 text-gray-700"/>}
              </button>
              <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full text-white flex items-center justify-center">
                P
              </span>
            </div>
          </header>

          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
              <nav className="bg-white dark:bg-gray-800 p-4 w-64 h-full">{navLinks}</nav>
            </div>
          )}

          <main className="pt-16 px-4 overflow-y-auto flex-1">{children}</main>
        </div>

        <aside className="hidden lg:block w-80 p-4 space-y-6">
          <RightSidebarWidgets />
          <SuggestedFollowers users={[
            { username: 'kingcode', avatar: '/avatars/king.jpg' },
            { username: 'blogqueen', avatar: '/avatars/queen.jpg' }
          ]} />
          <LiveNow streams={[
            { username: 'prophetlive', avatar: '/avatars/p1.jpg' },
            { username: 'coachonair', avatar: '/avatars/p2.jpg' }
          ]} />
          <TrendingTags tags={[
            { name: 'web3', count: 87 },
            { name: 'cyberchurch', count: 54 },
            { name: 'aiwriting', count: 32 }
          ]} />
        </aside>
      </div>
    </div>
  );
}