
import React, { useState } from 'react';
import DiscoveryCards from '@/components/DiscoveryCards';
import AnalyticsChart from '@/components/AnalyticsChart';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const AnalyticsPage = () => {
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-14');
  const { data, totals, loading } = useAnalyticsData(startDate, endDate);

  const exportToExcel = () => {
    window.open('/downloads/Admin_Analytics_Report.xlsx', '_blank');
  };

  return (
    <div className="p-6 space-y-6 dark:bg-black dark:text-white min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📊 Admin Analytics Dashboard</h1>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          📤 Export Report
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <section>
        <DiscoveryCards />
      </section>

      <section>
        <AnalyticsChart data={data} loading={loading} />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">New Users</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{totals.users}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Posts Created</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{totals.posts}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Earnings</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">${totals.earnings}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Total Views</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{totals.views}</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;
