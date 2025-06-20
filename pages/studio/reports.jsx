
import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Mock list for now; this would come from backend in real app
    setFiles([
      { name: 'weekly-report.pdf', url: '/reports/weekly-report.pdf', date: '2025-06-16' },
      { name: 'weekly-report-2025-06-09.pdf', url: '/reports/weekly-report-2025-06-09.pdf', date: '2025-06-09' }
    ]);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📂 Weekly Report Archives</h1>

      {files.length === 0 ? (
        <p>No reports available yet.</p>
      ) : (
        <ul className="space-y-4">
          {files.map((file, idx) => (
            <li key={idx} className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
              <div>
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-500">Generated on: {file.date}</p>
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                View PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
