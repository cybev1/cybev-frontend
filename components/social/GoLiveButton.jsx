import React from 'react';

/** Go Live button triggers streaming */
export default function GoLiveButton({ onStart }) {
  return (
    <button onClick={onStart} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg">
      Go Live
    </button>
  );
}
