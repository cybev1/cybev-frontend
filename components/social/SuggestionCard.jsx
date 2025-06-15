import React from 'react';

export default function SuggestionCard({ suggestion }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      {suggestion.title}
    </div>
);
}
