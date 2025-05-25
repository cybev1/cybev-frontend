import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';

export default function Earnings() {
  const [earnings, setEarnings] = useState([
    { title: 'Welcome to CYBEV', amount: 85, date: '2024-06-01' },
    { title: 'Minting with AI', amount: 150, date: '2024-06-05' },
    { title: 'Best Blogging Tips', amount: 230, date: '2024-06-07' }
  ]);

  const total = earnings.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-800">Earnings Report</h1>

        <Card>
          <h2 className="text-xl font-semibold mb-2">Total Earned</h2>
          <p className="text-2xl font-bold text-green-700">₡{total.toLocaleString()}</p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Earnings Breakdown</h2>
          <ul className="space-y-2 text-sm">
            {earnings.map((entry, i) => (
              <li key={i} className="border-b pb-2">
                <strong>₡{entry.amount}</strong> from <span className="font-medium">{entry.title}</span> on {entry.date}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}