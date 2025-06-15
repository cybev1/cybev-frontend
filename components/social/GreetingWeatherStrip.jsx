import React from 'react';

export default function GreetingWeatherStrip({ userName, weather }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-4">
      <div className="text-lg font-medium">Good morning, {userName}!</div>
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold">{weather.temp}°</div>
        <div>{weather.icon}</div>
      </div>
    </div>
  );
}
