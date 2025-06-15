import React from 'react';

export default function LeftNav() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-60 bg-white dark:bg-gray-800 p-4 border-r">
      <h2 className="text-xl font-bold mb-4">CYBEV</h2>
      <nav className="space-y-2">
        <a href="/feed" className="block px-2 py-1 rounded hover:bg-gray-200">Home</a>
        <a href="/explore" className="block px-2 py-1 rounded hover:bg-gray-200">Explore</a>
        <a href="/studio/stories" className="block px-2 py-1 rounded hover:bg-gray-200">Stories</a>
        <a href="/studio" className="block px-2 py-1 rounded hover:bg-gray-200">Studio</a>
      </nav>
    </aside>
);
}
