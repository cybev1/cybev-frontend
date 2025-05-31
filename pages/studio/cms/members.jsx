
import React, { useState } from 'react';

export default function CMSMembers() {
  const [members] = useState([
    { id: 1, name: 'John Doe', title: 'Mr', group: 'Faith Builders', joined: '2024-10-15' },
    { id: 2, name: 'Grace Nana', title: 'Ms', group: 'Soul Winners', joined: '2025-01-04' },
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">🧑‍🤝‍🧑 Members Directory</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Title</th>
              <th className="p-3">Group</th>
              <th className="p-3">Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3">{member.id}</td>
                <td className="p-3">{member.name}</td>
                <td className="p-3">{member.title}</td>
                <td className="p-3">{member.group}</td>
                <td className="p-3">{member.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
