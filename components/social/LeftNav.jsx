import React from 'react';
import NotificationBell from './NotificationBell';
import TokenBalance from './TokenBalance';
import CreateMenu from './CreateMenu';
import GoLiveModal from './GoLiveModal';
import Link from 'next/link';

export default function LeftNav() {
  return (
    <aside className="w-60 bg-white p-4 hidden lg:block">
      <Link href="/"><a className="text-2xl font-bold mb-4 block">CYBEV</a></Link>
      <NotificationBell />
      <TokenBalance />
      <nav className="mt-4 space-y-2">
        <Link href="/feed"><a className="block p-2 rounded hover:bg-gray-200">Home</a></Link>
        <Link href="/explore"><a className="block p-2 rounded hover:bg-gray-200">Explore</a></Link>
        <Link href="/studio/stories"><a className="block p-2 rounded hover:bg-gray-200">Stories</a></Link>
      </nav>
      <div className="mt-4 space-y-2">
        <CreateMenu />
        <GoLiveModal />
      </div>
    </aside>
);
}
