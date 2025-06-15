import React from 'react';
export default function GreetingWeatherStrip({ greeting, message, weather }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div>{greeting}</div>
      <div>{message}</div>
      <div>{weather.temp}° {weather.icon}</div>
    </div>
  );
}
