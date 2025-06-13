import React from 'react';

/** Suggestion card for people/pages */
export default function SuggestionCard({ suggestion }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow mb-4">
      <h3 className="font-semibold mb-2">{suggestion.title}</h3>
      <button className="bg-blue-600 text-white px-3 py-1 rounded">Follow</button>
    </div>
  );
}
