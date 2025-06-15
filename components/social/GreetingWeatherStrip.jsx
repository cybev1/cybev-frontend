import React from 'react';

export default function GreetingWeatherStrip({ greeting, message, weather }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div>
        <h2 className="text-lg font-semibold">{greeting}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">{weather.temp}°</span>
        <span className="text-2xl">{weather.icon}</span>
      </div>
    </div>
);
}
