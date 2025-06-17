
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#845EC2', '#00C49F', '#FF6F91', '#FFC75F'];

export default function DashboardInsights() {
  const [summary, setSummary] = useState('');
  const [trend, setTrend] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch('/api/admin/insight').then(res => res.json()).then(data => setSummary(data.summary));
    fetch('/api/admin/charts').then(res => res.json()).then(data => {
      setTrend(data.trends || []);
      setRoles(data.roles || []);
    });
  }, []);

  const pieData = roles.map((r, i) => ({
    name: r._id,
    value: r.count,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="mt-8 space-y-8">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-2">🧠 AI Summary</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">{summary || 'Loading...'}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">📈 Daily Metrics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="posts" stroke="#8884d8" />
            <Line type="monotone" dataKey="views" stroke="#82ca9d" />
            <Line type="monotone" dataKey="earnings" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">👤 Users by Role</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={\`cell-\${index}\`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
