import React, { useState } from 'react';
const emojis = ['👍','❤️','😂','😮','😢','😡'];

export default function ReactionPicker({ onReact }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(o => !o)} className="px-2 py-1">😀</button>
      {open && (
        <div className="absolute bottom-full mb-2 p-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex space-x-1">
          {emojis.map(e => (
            <button key={e} onClick={() => onReact(e)}>{e}</button>
          ))}
        </div>
      )}
    </div>
  );
}
