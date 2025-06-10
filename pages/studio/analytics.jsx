
import { useEffect, useState } from 'react'; 

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const blogId = 'mock-blog-id-123';

  useEffect(() => {
    const load = async () => {
      const res1 = await fetch('/api/analytics/earnings?blogId=' + blogId);
      const res2 = await fetch('/api/analytics/logs?blogId=' + blogId);
      const json1 = await res1.json();
      const json2 = await res2.json();
      if (json1.success) setSummary(json1.earnings);
      if (json2.success) setLogs(json2.logs);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📊 Blog Analytics Dashboard</h1>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8 bg-white p-6 rounded-xl shadow">
            <div><h2 className="text-xl font-bold text-blue-700">{summary.totalPosts}</h2><p className="text-gray-500">Posts</p></div>
            <div><h2 className="text-xl font-bold text-indigo-700">{summary.totalViews}</h2><p className="text-gray-500">Views</p></div>
            <div><h2 className="text-xl font-bold text-green-700">{summary.totalShares}</h2><p className="text-gray-500">Shares</p></div>
            <div><h2 className="text-xl font-bold text-yellow-600">${summary.estEarnings}</h2><p className="text-gray-500">Earnings</p></div>
          </div>

          <h2 className="text-xl font-semibold mb-2">🌍 Geo & Device Logs</h2>
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3">Country</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Browser</th>
                  <th className="p-3">Device</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">{log.country}</td>
                    <td className="p-3">{log.city}</td>
                    <td className="p-3">{log.browser}</td>
                    <td className="p-3">{log.device}</td>
                    <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
