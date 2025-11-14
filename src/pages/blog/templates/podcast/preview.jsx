import React from 'react';

export default function PodcastPreview() {
  return (
    <div className="p-6 space-y-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900">Podcast Blog</h1>
      <p className="text-gray-600">A home for your episodes, transcriptions, and show notes.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold">Sample Post 1</h2>
          <p className="text-sm text-gray-500">Welcome to your new layout — post something amazing!</p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold">Sample Post 2</h2>
          <p className="text-sm text-gray-500">Perfect for category pages, featured highlights, and more.</p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold">Sample Post 3</h2>
          <p className="text-sm text-gray-500">Editable blocks and dynamic sections await.</p>
        </div>
      </div>
    </div>
  );
}
