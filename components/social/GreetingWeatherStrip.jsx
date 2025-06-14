import React from 'react';

export default function GreetingWeatherStrip() {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow">
      {/* Greeting and Weather stub */}
      <div className="text-xl font-semibold">Good morning, Prince!</div>
      <div className="text-sm text-gray-500">72°F ☀️</div>
    </div>
  );
}
