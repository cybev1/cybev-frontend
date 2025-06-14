import React, { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/24/solid';

const options = [
  { label: 'Blog', route: '/studio/create/blog' },
  { label: 'Article', route: '/studio/create/article' },
  { label: 'Event', route: '/studio/create/event' },
  { label: 'Page', route: '/studio/create/page' },
  { label: 'Group', route: '/studio/create/group' },
  { label: 'Advertisement', route: '/studio/create/ads' },
  { label: 'Photo', route: '/studio/create/photo' },
  { label: 'NFT', route: '/studio/create/nft' },
  { label: 'Campaign', route: '/studio/create/campaign' },
  { label: 'Chat/Call', route: '/studio/create/chat' },
];

export default function CreateMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        <span className="ml-2">Create ▾</span>
      </button>
      {open && (
        <div className="absolute mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {options.map(opt => (
            <a
              key={opt.label}
              href={opt.route}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {opt.label}
            </a>
          ))}
        </div>
      )}
    </div>
);