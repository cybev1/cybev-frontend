import React from 'react';

export default function GoLiveModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Go Live</h2>
        <button className="mb-2 px-4 py-2 bg-blue-600 text-white rounded">Use Device Camera</button>
        <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded">RTMP Stream (OBS, etc.)</button>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">Close</button>
      </div>
    </div>
  );
}
