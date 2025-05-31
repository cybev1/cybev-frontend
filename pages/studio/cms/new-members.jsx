
import React, { useState } from 'react';

export default function CMSNewMembers() {
  const [newMembers] = useState([
    { id: 1, name: 'Samuel Bright', group: 'Faith Builders', dateJoined: '2025-05-30', followUp: 'Scheduled' },
    { id: 2, name: 'Mary Blessing', group: 'Soul Winners', dateJoined: '2025-05-29', followUp: 'Completed' },
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">🌱 New Member Tracker</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Group</th>
              <th className="p-3">Date Joined</th>
              <th className="p-3">Follow-Up Status</th>
            </tr>
          </thead>
          <tbody>
            {newMembers.map((entry) => (
              <tr key={entry.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3">{entry.id}</td>
                <td className="p-3">{entry.name}</td>
                <td className="p-3">{entry.group}</td>
                <td className="p-3">{entry.dateJoined}</td>
                <td className="p-3">{entry.followUp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
