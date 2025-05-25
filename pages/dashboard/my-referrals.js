import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';

export default function MyReferrals() {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/users/my-referrals', {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => setReferrals(data || []));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-800">My Referrals</h1>

        <Card>
          <h2 className="text-xl font-semibold mb-2">You’ve Referred {referrals.length} User(s)</h2>
          <p className="text-green-700 font-bold mb-4">Total Earned: ₡{referrals.length * 25}</p>
          <ul className="text-sm space-y-2">
            {referrals.map((ref, i) => (
              <li key={i} className="border-b pb-1">
                {ref.username || 'New User'} — Joined on {new Date(ref.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}