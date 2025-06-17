
import React, { useEffect, useState } from 'react';

export default function AuditArchivePage({ userRole = 'super-admin' }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'super-admin') return;

    fetch('/api/audit/archive')
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      });
  }, [userRole]);

  if (userRole !== 'super-admin') return null;

  return (
    <div className="p-6 dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-purple-500 mb-6">📂 Audit Report Archive</h1>

      {loading ? (
        <p className="text-sm text-gray-400">Loading archived reports...</p>
      ) : (
        <ul className="space-y-2 text-sm text-white">
          {files.map((file, idx) => (
            <li key={idx}>
              <a
                href={`/reports/${file}`}
                download
                className="text-blue-400 underline hover:text-blue-200"
              >
                {file}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
