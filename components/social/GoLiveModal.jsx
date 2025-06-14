import React, { useState } from 'react';

export default function GoLiveModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Go Live
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Start Live Stream</h2>
            <p className="mb-2">Choose your source:</p>
            <button className="w-full mb-2 px-4 py-2 bg-blue-600 text-white rounded">
              Use Device Camera
            </button>
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded">
              RTMP Stream (OBS, etc.)
            </button>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 text-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
