import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MoonIcon, SunIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <nav className="flex items-center justify-between px-4 py-3 shadow-md sticky top-0 z-50 bg-white dark:bg-gray-800">
      <Link href="/" className="text-xl font-bold text-blue-900 dark:text-white">CYBEV.IO</Link>
      <div className="md:hidden flex items-center gap-3">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>
      <div className={`md:flex gap-6 ${menuOpen ? 'block' : 'hidden'} md:block`}>
        <Link href="/">Home</Link>
        <Link href="#features">Features</Link>
        <Link href="#contact">Contact</Link>
      </div>
    </nav>
  );
}
