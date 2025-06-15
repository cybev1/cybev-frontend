import React from 'react';

export default function SuggestionCard({ suggestion }) {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
      <div className="font-semibold">{suggestion.title}</div>
      <div>Suggestions content here</div>
    </div>
  );
}