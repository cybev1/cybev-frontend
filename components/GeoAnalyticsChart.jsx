
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const GeoAnalyticsChart = ({ data = [], loading }) => {
  if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading geographic data...</p>;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">🌍 Top Locations by Views</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="city" type="category" />
          <Tooltip />
          <Bar dataKey="views" fill="#8884d8" name="Views" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GeoAnalyticsChart;
