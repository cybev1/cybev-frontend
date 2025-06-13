import React from 'react';

/**
 * Greeting with motivational message and weather
 */
export default function GreetingWeatherStrip({ greeting, message, weather }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">{greeting}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold">{weather.temp}°</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{weather.icon}</div>
      </div>
    </div>
