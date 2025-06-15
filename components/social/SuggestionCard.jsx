import React from 'react';

export default function SuggestionCard({ suggestion }) {
  return (
    <div className="p-4 bg-white border rounded">
      Suggestion: {suggestion.title}
    </div>
  );
}
