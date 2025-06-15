import React from 'react';
import Link from 'next/link';

export default function LeftNav() {
  return (
    <aside className="w-60 bg-white dark:bg-gray-800 p-4 overflow-auto hidden lg:block">
      <div className="mb-6">
        <Link href="/">
          <a className="text-2xl font-bold text-blue-600 dark:text-white">CYBEV</a>
        </Link>
      </div>
      <nav className="space-y-2">
        <Link href="/feed"><a className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Home</a></Link>
        <Link href="/explore"><a className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Explore</a></Link>
        <Link href="/studio"><a className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">Studio</a></Link>
      </nav>
    </aside>
}