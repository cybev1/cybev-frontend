
import React from 'react';
import DiscoveryCards from '@/components/DiscoveryCards';

const AnalyticsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Admin Analytics Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Discovery Section</h2>
        <DiscoveryCards />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">New Users</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">28</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Posts Created</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">90</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Earnings</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">$260</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Total Views</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">1,700</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;
