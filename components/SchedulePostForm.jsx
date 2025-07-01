import { useState } from 'react';

export default function SchedulePostForm({ onSchedule }) {
  const [datetime, setDatetime] = useState('');

  const handleSchedule = () => {
    if (!datetime) return;
    onSchedule(datetime);
    // await fetch('/api/post/schedule', { method: 'POST', body: JSON.stringify({ datetime }) });
  };

  return (
    <div className="mt-4 space-y-2">
      <label className="text-sm text-gray-700 dark:text-gray-300">Schedule Post</label>
      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        className="w-full px-3 py-2 rounded-md border dark:bg-gray-700"
      />
      <button onClick={handleSchedule} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md">
        🗓️ Schedule
      </button>
    </div>
  );
}