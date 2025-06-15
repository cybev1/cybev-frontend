import React from 'react';

export default function GreetingWeatherStrip() {
  const weather = { temp: 72, icon: '☀️' };
  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <div className="flex justify-between items-center bg-blue-100 p-4 rounded">
      <div>{greeting}, Prince – Today is a great day…</div>
      <div className="flex items-center space-x-2">
        <div>{weather.icon}</div>
        <div>{weather.temp}°F</div>
      </div>
    </div>
  );
}
