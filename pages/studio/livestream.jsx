
import { useEffect, useState } from 'react';

export default function LivestreamStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Mock API response
    setStats({
      totalStreams: 7,
      totalViewers: 1342,
      avgWatchTime: '22m 18s',
      topStream: 'Faith & Finance',
      locations: ['Nigeria', 'Ghana', 'Kenya', 'USA']
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🔴 Livestream Report</h1>

      {!stats ? (
        <p>Loading livestream data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
              <h2 className="text-sm text-gray-500">Total Streams</h2>
              <p className="text-2xl font-bold">{stats.totalStreams}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
              <h2 className="text-sm text-gray-500">Total Viewers</h2>
              <p className="text-2xl font-bold">{stats.totalViewers.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
              <h2 className="text-sm text-gray-500">Avg Watch Time</h2>
              <p className="text-2xl font-bold">{stats.avgWatchTime}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
              <h2 className="text-sm text-gray-500">Top Performing Stream</h2>
              <p className="text-xl font-semibold">{stats.topStream}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold mb-2">🌍 Viewer Locations</h2>
            <ul className="list-disc ml-6 text-sm text-gray-600 dark:text-gray-300">
              {stats.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
