
import React, { useState } from 'react';

export default function CMSServices() {
  const [services] = useState([
    { id: 1, title: 'Sunday Celebration Service', date: '2025-05-26', location: 'Main Hall', attendance: 125 },
    { id: 2, title: 'Wednesday Midweek Service', date: '2025-05-29', location: 'Online Zoom', attendance: 98 },
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">📋 Service Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Service Title</th>
              <th className="p-3">Date</th>
              <th className="p-3">Location</th>
              <th className="p-3">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {services.map((entry) => (
              <tr key={entry.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3">{entry.id}</td>
                <td className="p-3">{entry.title}</td>
                <td className="p-3">{entry.date}</td>
                <td className="p-3">{entry.location}</td>
                <td className="p-3 font-medium">{entry.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
