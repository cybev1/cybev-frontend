import React, { useState } from 'react';

export default function GoLiveModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 bg-green-600 text-white rounded-lg">Go Live</button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Go Live</h2>
            <p>Streaming setup options will go here (device camera / RTMP).</p>
            <button onClick={() => setOpen(false)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
