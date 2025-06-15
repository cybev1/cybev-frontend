import React from 'react';

export default function RightHub() {
  return (
    <div className="space-y-4">
      <div className="font-bold">People You May Know</div>
      {['Charlie', 'Dave', 'Mallory'].map(name => (
        <div key={name} className="p-2 bg-gray-200 rounded">{name}</div>
      ))}
    </div>
  );
}
