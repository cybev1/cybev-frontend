
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const EarningsBreakdownChart = ({ data = [], loading }) => {
  if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading earnings breakdown...</p>;

  const pieData = Object.entries(data).map(([key, value], i) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">💸 Earnings Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsBreakdownChart;
