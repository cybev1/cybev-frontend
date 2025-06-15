import React, { useState } from 'react';

export default function CyBevBotWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleAsk = () => {
    setResponse('🔍 Fact-checking... (Simulated)');
    setTimeout(() => {
      setResponse('✅ This claim is accurate based on current verified sources.');
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 cursor-pointer" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {open && (
        <div className="mt-2 w-80 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">CyBev Bot</h3>
          <input
            type="text"
            className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Enter claim or question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleAsk}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
          >
            Fact-check
          </button>
          {response && <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">{response}</div>}
        </div>
      )}
    </div>
  );
}
