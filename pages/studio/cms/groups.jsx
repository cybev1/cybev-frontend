
import React, { useState } from 'react';

export default function CMSGroups() {
  const [groups] = useState([
    { id: 1, name: 'Faith Builders', leader: 'Pastor James', members: 24 },
    { id: 2, name: 'Soul Winners', leader: 'Sis. Grace', members: 18 },
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">👥 Groups Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Group Name</th>
              <th className="p-3">Leader</th>
              <th className="p-3">Members</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3">{group.id}</td>
                <td className="p-3">{group.name}</td>
                <td className="p-3">{group.leader}</td>
                <td className="p-3">{group.members}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
