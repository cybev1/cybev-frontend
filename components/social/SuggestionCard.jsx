// components/social/SuggestionCard.jsx
import React from 'react';

export default function SuggestionCard({ suggestion }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <p>{suggestion.title}</p>
      <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded">Add</button>
    </div>
);
}
