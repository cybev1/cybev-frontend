import React from 'react';

export default function BusinesscareerPreview() {
  return (
    <div className="p-6 space-y-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900">Business & Career Blog</h1>
      <p className="text-gray-600">Professional insights, entrepreneurship journeys, and corporate strategies.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold">Sample Post 1</h2>
          <p className="text-sm text-gray-500">A captivating snippet for this blog layout...</p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold">Sample Post 2</h2>
          <p className="text-sm text-gray-500">Highlighting the versatility of your template...</p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold">Sample Post 3</h2>
          <p className="text-sm text-gray-500">Clean visual structure with CTA and image areas...</p>
        </div>
      </div>
    </div>
  );
}
