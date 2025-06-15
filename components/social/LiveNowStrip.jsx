import React from 'react';
export default function LiveNowStrip({ stream }) {
  return <div className="p-2 bg-red-100 rounded">Live Now: {stream.title}</div>;
}
