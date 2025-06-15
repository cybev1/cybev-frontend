import React, { useState } from 'react';

export default function PostComposer() {
  const [content, setContent] = useState('');
  const [monetize, setMonetize] = useState(false);
  const [draft, setDraft] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    console.log({
      content,
      monetize,
      draft,
      scheduledTime,
      file
    });
    alert('Post submitted! (This is just a mock)');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <textarea
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
        rows={3}
        placeholder="What's on your mind today?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={monetize} onChange={() => setMonetize(!monetize)} />
          <span className="text-sm text-gray-700 dark:text-gray-300">Monetize this post</span>
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={draft} onChange={() => setDraft(!draft)} />
          <span className="text-sm text-gray-700 dark:text-gray-300">Save as draft</span>
        </label>
      </div>

      <div className="flex items-center justify-between mb-2">
        <input
          type="datetime-local"
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
        />
        <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          📎
          <input
            type="file"
            className="ml-2"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Post
        </button>
      </div>
    </div>
  );
}
