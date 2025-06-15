import React from 'react';
export default function NewsTicker({ headlines }) {
  return <div className="p-2 bg-yellow-100 rounded">{headlines.join(' | ')}</div>;
}
