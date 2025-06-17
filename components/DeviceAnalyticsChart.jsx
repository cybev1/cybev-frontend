
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];

const DeviceAnalyticsChart = ({ data = [], loading }) => {
  if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading device analytics...</p>;

  const pieData = data.map((d, i) => ({
    name: `${d.platform} - ${d.browser}`,
    value: d.count,
    color: COLORS[i % COLORS.length]
  }));

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">🖥 Device & Browser Usage</h2>
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

export default DeviceAnalyticsChart;
