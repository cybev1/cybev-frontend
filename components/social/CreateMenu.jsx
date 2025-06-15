import React, { useState } from 'react';

export default function CreateMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create ▾
      </button>
      {open && (
        <ul className="absolute mt-2 bg-white border rounded shadow">
          <li className="px-4 py-2 hover:bg-gray-100"><a href="/studio/create/blog">Blog</a></li>
          <li className="px-4 py-2 hover:bg-gray-100"><a href="/studio/create/article">Article</a></li>
        </ul>
      )}
    </div>
  );
}
