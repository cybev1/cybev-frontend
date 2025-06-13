import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon, MenuIcon, XIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const navLinks = (
    <>
      <Link href="/features"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Features</a></Link>
      <Link href="/setup"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Create a Blog</a></Link>
      <Link href="/timeline"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Timeline</a></Link>
      <Link href="/explore"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Explore</a></Link>
      <Link href="/about"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">About Us</a></Link>
      <Link href="/contact"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Contact</a></Link>
      <Link href="/register"><a className="block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Get Started</a></Link>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar */}
      <aside className="w-60 bg-white dark:bg-gray-800 p-4 overflow-auto hidden lg:block">
        <div className="mb-6">
          <Link href="/"><a className="text-2xl font-bold text-blue-600 dark:text-white">CYBEV</a></Link>
        </div>
        <nav className="space-y-2">
          <Link href="/feed"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Home</a></Link>
          <Link href="/explore"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Explore</a></Link>
          <Link href="/studio/stories"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Stories</a></Link>
          <Link href="/studio"><a className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Studio</a></Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 shadow fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <XIcon className="w-6 h-6 text-gray-800 dark:text-gray-200"/> : <MenuIcon className="w-6 h-6 text-gray-800 dark:text-gray-200"/>}
            </button>
            <Link href="/"><a className="text-xl font-bold text-blue-600 dark:text-white">CYBEV</a></Link>
            <div className="hidden md:flex space-x-4">
              {navLinks}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme}>
              {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400"/> : <MoonIcon className="w-5 h-5 text-gray-700"/>}
            </button>
            <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full text-white flex items-center justify-center">P</span>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="bg-white dark:bg-gray-800 shadow md:hidden fixed top-14 left-0 right-0 z-40">
            {navLinks}
          </nav>
        )}

        <main className="pt-16 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
