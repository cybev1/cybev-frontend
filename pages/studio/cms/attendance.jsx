
import React, { useState } from 'react';

export default function CMSAttendance() {
  const [attendance] = useState([
    { id: 1, name: 'John Doe', group: 'Faith Builders', service: 'Sunday 9AM', date: '2025-05-26', status: 'Present' },
    { id: 2, name: 'Grace Nana', group: 'Soul Winners', service: 'Sunday 9AM', date: '2025-05-26', status: 'Absent' },
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 Attendance Tracker</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Group</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((entry) => (
              <tr key={entry.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3">{entry.id}</td>
                <td className="p-3">{entry.name}</td>
                <td className="p-3">{entry.group}</td>
                <td className="p-3">{entry.service}</td>
                <td className="p-3">{entry.date}</td>
                <td className="p-3">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
