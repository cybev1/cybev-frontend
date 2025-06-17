
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const AnalyticsChart = ({ data = [], loading }) => {
  if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">📈 Growth Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#8884d8" name="New Users" />
          <Line type="monotone" dataKey="posts" stroke="#82ca9d" name="Posts Created" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
