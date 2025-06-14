import React from 'react';

export default function GreetingWeatherStrip({ greeting, weather }) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow">
      <div className="text-xl font-semibold">{greeting}</div>
      <div className="text-sm text-gray-500">{weather.temp}° {weather.icon}</div>
    </div>
  );
}
