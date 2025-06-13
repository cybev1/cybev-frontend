// components/social/GroupCard.jsx
import React from 'react';

export default function GroupCard({ group }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="font-semibold mb-2">{group.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{group.description}</p>
      <button className="mt-4 px-3 py-1 bg-blue-600 text-white rounded">Join</button>
    </div>
  );
}
