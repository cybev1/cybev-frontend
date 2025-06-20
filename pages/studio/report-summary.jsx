
import { useEffect, useState } from 'react';

export default function ReportSummary() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Simulate report generation
    setReport({
      week: 'June 10 – June 16, 2025',
      posts: 8,
      views: 3450,
      shares: 290,
      earnings: 187.45,
      mints: 6,
      boosts: 11,
      summary: "Your engagement this week increased by 14%. Posts with AI-generated summaries performed best. Keep posting consistently to maintain visibility."
    });
  }, []);

  const handleDownload = () => {
    alert("📄 Export to PDF triggered (mock)");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">📄 Weekly Report Summary</h1>
      {!report ? (
        <p>Generating report...</p>
      ) : (
        <>
          <div className="mb-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">🗓️ Report Period: {report.week}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>📝 Posts: <strong>{report.posts}</strong></li>
              <li>👁️ Views: <strong>{report.views.toLocaleString()}</strong></li>
              <li>🔁 Shares: <strong>{report.shares}</strong></li>
              <li>🪙 Earnings: <strong>₿ {report.earnings.toFixed(2)} CYBV</strong></li>
              <li>🎖️ Mints: <strong>{report.mints}</strong></li>
              <li>🚀 Boosts: <strong>{report.boosts}</strong></li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">🧠 AI Insight</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{report.summary}</p>
          </div>

          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
          >
            ⬇️ Download PDF
          </button>
        </>
      )}
    </div>
  );
}
