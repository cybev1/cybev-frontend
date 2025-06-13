import React from 'react';

/** Dropdown Create menu */
export default function CreateMenu({ open }) {
  if (!open) return null;
  const items = ['Blog', 'Article', 'Event', 'Page', 'Group', 'Ad', 'Photo', 'NFT', 'Campaign', 'Chat/Call'];
  return (
    <div className="absolute bg-white dark:bg-gray-800 shadow rounded p-2">
      {items.map(item => (
        <div key={item} className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
          {item}
        </div>
      ))}
    </div>
  );
}
