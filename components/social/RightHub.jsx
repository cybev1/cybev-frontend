import React from 'react';

export default function RightHub({ data }) {
  return (
    <aside className="w-80 bg-white dark:bg-gray-800 p-4 hidden xl:block">
      <div className="font-semibold mb-2">Recommended</div>
      <div>Right sidebar content with suggestions, groups, events...</div>
    </aside>
  );
}