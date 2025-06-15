// components/social/GreetingWeatherStrip.jsx
import React from 'react';

export default function GreetingWeatherStrip({ greeting, message, weather }) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div>
        <h1 className="text-xl font-bold">{greeting}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
      <div className="flex items-center">
        <span className="text-2xl mr-2">{weather.icon}</span>
        <span>{weather.temp}°F</span>
      </div>
    </div>
);
}
