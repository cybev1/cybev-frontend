import React from 'react';

/** Live streaming strip */
export default function LiveNowStrip({ stream }) {
  return (
    <div className="p-2 bg-red-500 text-white rounded mb-4 text-center">
      🔴 Live Now: {stream.title}
    </div>
  );
}
