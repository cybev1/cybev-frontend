
import React, { useState, useEffect } from 'react';

export default function ManualReportTrigger({ userRole = 'admin' }) {
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState('2025-06-10');
  const [end, setEnd] = useState('2025-06-17');
  const [message, setMessage] = useState('');

  const triggerReport = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/analytics/trigger-report?start=${start}&end=${end}`);
      const result = await res.json();
      if (res.ok) {
        setMessage('✅ Manual report sent successfully!');
      } else {
        setMessage('❌ Failed to send report');
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Error triggering report');
    }
    setLoading(false);
  };

  if (userRole !== 'super-admin') return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mt-6 space-y-4">
      <h2 className="text-lg font-semibold">🚀 Manually Trigger Report (Super Admin)</h2>
      <div className="flex flex-wrap gap-3 items-center">
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
          className="px-3 py-2 rounded border dark:bg-gray-900 dark:border-gray-700" />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)}
          className="px-3 py-2 rounded border dark:bg-gray-900 dark:border-gray-700" />
        <button
          onClick={triggerReport}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? 'Sending...' : '📤 Send Manual Report'}
        </button>
      </div>
      {message && <p className="text-sm text-green-400">{message}</p>}
    </div>
  );
}
