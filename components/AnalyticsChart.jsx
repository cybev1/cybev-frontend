
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jun 1', users: 12, posts: 50 },
  { date: 'Jun 2', users: 18, posts: 65 },
  { date: 'Jun 3', users: 25, posts: 60 },
  { date: 'Jun 4', users: 30, posts: 70 },
  { date: 'Jun 5', users: 28, posts: 55 },
  { date: 'Jun 6', users: 15, posts: 45 },
  { date: 'Jun 7', users: 20, posts: 68 },
  { date: 'Jun 8', users: 22, posts: 72 },
  { date: 'Jun 9', users: 26, posts: 75 },
  { date: 'Jun 10', users: 24, posts: 60 },
  { date: 'Jun 11', users: 18, posts: 58 },
  { date: 'Jun 12', users: 30, posts: 80 },
  { date: 'Jun 13', users: 32, posts: 90 },
  { date: 'Jun 14', users: 29, posts: 85 }
];

const AnalyticsChart = () => {
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
