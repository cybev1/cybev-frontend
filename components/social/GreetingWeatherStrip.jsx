import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function GreetingWeatherStrip() {
  const { data, error } = useSWR('/api/weather/today', fetcher);

  if (!data) return null;
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div className="text-lg">Good morning Prince — Today is a great day!</div>
      <div className="flex items-center">
        <div className="mr-2">{data.temperature}°C</div>
        <img src={data.iconUrl} alt="weather icon" className="w-6 h-6" />
      </div>
    </div>
  );
}