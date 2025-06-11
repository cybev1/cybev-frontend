
import React from 'react';
import { FileText, FileDown } from 'lucide-react';

export default function ExportAnalytics() {
  const handleExportPDF = () => {
    alert("📄 Export to PDF triggered (backend logic pending)");
  };

  const handleExportCSV = () => {
    alert("📊 Export to CSV triggered (backend logic pending)");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FileText size={28} /> Export Reports
      </h1>
      <div className="space-y-4">
        <p className="text-gray-600">Export your analytics data as a PDF report or CSV spreadsheet for offline analysis, presentations, or record-keeping.</p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <FileDown size={18} /> Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FileDown size={18} /> Export CSV
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-4">* Exports will include top posts, earnings, mint data, boosts, and engagement logs.</p>
      </div>
    </div>
  );
}
