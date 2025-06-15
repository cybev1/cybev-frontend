import React from 'react';
import Link from 'next/link';
import CreateMenu from './CreateMenu';

export default function LeftNav() {
  return (
    <aside className="hidden md:block w-64 p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">CYBEV</h2>
      <nav className="space-y-2">
        <Link href="/feed"><a className="block p-2 hover:bg-gray-200 rounded">Feed</a></Link>
        <Link href="/studio"><a className="block p-2 hover:bg-gray-200 rounded">Studio</a></Link>
      </nav>
      <div className="mt-4">
        <CreateMenu />
      </div>
    </aside>
  );
}
