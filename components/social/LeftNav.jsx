import React from 'react';
import Link from 'next/link';
import CreateMenu from './CreateMenu';

export default function LeftNav() {
  return (
    <nav className="space-y-4">
      <div className="text-2xl font-bold">CYBEV</div>
      <input type="text" placeholder="Search…" className="w-full p-2 border rounded" />
      <ul className="space-y-2">
        <li><Link href="/feed"><a className="block p-2 hover:bg-gray-200 rounded">Home</a></Link></li>
        <li><Link href="/explore"><a className="block p-2 hover:bg-gray-200 rounded">Explore</a></Link></li>
        <li><Link href="/stories"><a className="block p-2 hover:bg-gray-200 rounded">Stories</a></Link></li>
        <li><Link href="/studio"><a className="block p-2 hover:bg-gray-200 rounded">Studio</a></Link></li>
      </ul>
      <CreateMenu />
    </nav>
  );
}
