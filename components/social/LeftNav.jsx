import React from 'react';
import Link from 'next/link';

export default function LeftNav() {
  return (
    <nav className="p-4 space-y-2">
      <Link href="/feed"><a className="block p-2 hover:bg-gray-100 rounded">Home</a></Link>
      <Link href="/explore"><a className="block p-2 hover:bg-gray-100 rounded">Explore</a></Link>
      <Link href="/stories"><a className="block p-2 hover:bg-gray-100 rounded">Stories</a></Link>
    </nav>
  );
}
