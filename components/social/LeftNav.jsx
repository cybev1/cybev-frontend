// components/social/LeftNav.jsx
import React from 'react';
import Link from 'next/link';

export default function LeftNav() {
  return (
    <aside className="w-20 bg-white dark:bg-gray-800 p-4">
      <nav className="space-y-4 flex flex-col items-center">
        <Link href="/"><a>Feed</a></Link>
        <Link href="/studio"><a>Studio</a></Link>
        <Link href="/profile"><a>Profile</a></Link>
      </nav>
    </aside>
);
}
