import React, { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/24/solid';

const options = ['Blog','Photo','NFT','Event'];

export default function CreateMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded">
        {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}<span className="ml-2">Create</span>
      </button>
      {open && (
        <div className="absolute mt-2 bg-white border rounded shadow z-10">
          {options.map(opt => <a key={opt} href="#" className="block px-4 py-2 hover:bg-gray-100">{opt}</a>)}
        </div>
      )}
    </div>
  );
}
