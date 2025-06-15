import React from 'react';

export default function LiveNowStrip({ stream }) {
  return (
    <div className="p-2 bg-red-600 text-white rounded-lg text-center font-semibold">
      🔴 LIVE NOW: {stream.title}
    </div>
);
}
