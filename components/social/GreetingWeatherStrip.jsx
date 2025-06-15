import React from 'react';

export default function GreetingWeatherStrip() {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow rounded-lg mb-4">
      <div>
        <div className="text-lg font-semibold">Good morning, Prince</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Have a great day!</div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold">72°</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">☀️</div>
      </div>
    </div>
  );
}