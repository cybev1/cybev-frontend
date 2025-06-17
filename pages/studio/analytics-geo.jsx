
import React, { useState } from 'react';
import GeoAnalyticsChart from '@/components/GeoAnalyticsChart';
import { useGeoAnalytics } from '@/hooks/useGeoAnalytics';

const GeoAnalyticsPage = () => {
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-14');
  const { data, loading } = useGeoAnalytics(startDate, endDate);

  return (
    <div className="p-6 space-y-6 dark:bg-black dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold">📍 Geographic Analytics</h1>

      <div className="flex gap-4">
        <div>
          <label className="text-sm">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block mt-1 p-2 rounded dark:bg-gray-900 border dark:border-gray-700"
          />
        </div>
        <div>
          <label className="text-sm">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block mt-1 p-2 rounded dark:bg-gray-900 border dark:border-gray-700"
          />
        </div>
      </div>

      <GeoAnalyticsChart data={data} loading={loading} />
    </div>
  );
};

export default GeoAnalyticsPage;
