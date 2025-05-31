
import React, { useState } from 'react';

export default function CMSReports() {
  const [reports] = useState([
    { id: 1, title: 'May Member Summary', submittedBy: 'Pastor James', date: '2025-05-30', status: 'Reviewed' },
    { id: 2, title: 'Weekly Attendance Analysis', submittedBy: 'Sis. Grace', date: '2025-05-27', status: 'Pending' },
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Admin Reports</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Report Title</th>
              <th className="p-3">Submitted By</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((entry) => (
              <tr key={entry.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3">{entry.id}</td>
                <td className="p-3">{entry.title}</td>
                <td className="p-3">{entry.submittedBy}</td>
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
