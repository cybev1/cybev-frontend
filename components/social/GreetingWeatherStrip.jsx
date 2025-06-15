import React from 'react';

export default function GreetingWeatherStrip({ weather }) {
  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded">
      <div className="text-lg">Good morning, User!</div>
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold">{weather.temp}°</div>
        <div className="text-2xl">{weather.icon}</div>
      </div>
    </div>
  );
}
