import React, { useState, useRef, useEffect } from 'react';

const OPTIONS = [
  'Blog', 'Article', 'Event', 'Page', 'Group',
  'Advertisement', 'Photo', 'NFT', 'Campaign',
  'Chat/Call (Video)', 'Chat/Call (Voice)', 'Go Live'
];

export default function CreateMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = option => {
    setOpen(false);
    console.log('Selected:', option);
    // TODO: trigger modal or navigation
  };

  return (
    <div ref={menuRef} className="fixed bottom-4 right-4">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Create ▾
      </button>
      {open && (
        <div className="mt-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-48">
          {OPTIONS.map(opt => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer text-sm"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
