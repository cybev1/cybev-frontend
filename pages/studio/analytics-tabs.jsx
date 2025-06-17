
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const OverviewTab = dynamic(() => import('@/pages/studio/analytics'));
const GeoTab = dynamic(() => import('@/pages/studio/analytics-geo'));
const DeviceTab = dynamic(() => import('@/pages/studio/analytics-device'));
const EarningsTab = dynamic(() => import('@/pages/studio/analytics-earnings'));

const AnalyticsTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-14');

  const tabStyle = (tab) =>
    `px-4 py-2 rounded-t-lg font-medium text-sm ${activeTab === tab
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`;

  const downloadReport = () => {
    const url = `/api/analytics/report?start=${startDate}&end=${endDate}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 dark:bg-black dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📈 Admin Analytics</h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded px-3 py-1 border dark:bg-gray-900 dark:border-gray-700"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded px-3 py-1 border dark:bg-gray-900 dark:border-gray-700"
          />
        </div>

        <button
          onClick={downloadReport}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        >
          📥 Export PDF
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('overview')} className={tabStyle('overview')}>📊 Overview</button>
        <button onClick={() => setActiveTab('geo')} className={tabStyle('geo')}>🌍 Geographic</button>
        <button onClick={() => setActiveTab('device')} className={tabStyle('device')}>🖥 Device</button>
        <button onClick={() => setActiveTab('earnings')} className={tabStyle('earnings')}>💸 Earnings</button>
      </div>

      <div className="rounded-xl bg-white dark:bg-gray-900 p-4 shadow-md">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'geo' && <GeoTab />}
        {activeTab === 'device' && <DeviceTab />}
        {activeTab === 'earnings' && <EarningsTab />}
      </div>
    </div>
  );
};

export default AnalyticsTabs;
