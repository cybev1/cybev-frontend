
import React from 'react';
import { CheckCircle } from 'lucide-react';

const items = [
  { title: "PDF Generator Script", status: "✅ Ready", path: "/scripts/generateWeeklyReport.js" },
  { title: "Email Report Sender", status: "✅ Ready", path: "/api/report/send.js" },
  { title: "Cron Scheduler", status: "✅ Active", path: "Railway Schedule (08:00 UTC Mondays)" },
  { title: "Export to PDF/CSV", status: "✅ Working", path: "/studio/analytics/export" },
  { title: "Reports Viewer", status: "✅ Live", path: "/studio/analytics/reports" },
  { title: "Admin Logs", status: "✅ Logging", path: "/studio/analytics/admin-logs" },
  { title: "Activity Logger", status: "✅ Installed", path: "/utils/logActivity.js" },
];

export default function ReportChecklist() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <CheckCircle size={28} /> CYBEV Reporting Engine Status
      </h1>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">{item.title}</p>
              <p className="text-sm text-gray-500">{item.path}</p>
            </div>
            <span className="text-green-600 font-semibold">{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
