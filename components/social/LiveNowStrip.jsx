// components/social/LiveNowStrip.jsx
import React from 'react';

export default function LiveNowStrip({ stream }) {
  return (
    <div className="bg-red-100 p-4 rounded-lg shadow">
      🔴 Live Now: {stream.title}
    </div>
);
}
