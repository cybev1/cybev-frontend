
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function WeeklyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch('/reports/index.json')
      .then(res => res.json())
      .then(data => setReports(data.reverse())) // latest first
      .catch(() => setReports([]));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <FileText size={28} /> Weekly Report Archive
      </h1>
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports found yet.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report, i) => (
            <li key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">📅 {report.date}</p>
                <p className="text-sm text-gray-500">{report.file}</p>
              </div>
              <a
                href={`/reports/${report.file}`}
                target="_blank"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
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
