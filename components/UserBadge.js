import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function getUserTier(amount) {
  if (amount >= 1000) return '💎 Diamond';
  if (amount >= 500) return '🥇 Gold';
  if (amount >= 100) return '🥈 Silver';
  return '🥉 Bronze';
}

export default function UserBadge() {
  const router = useRouter();
  const [tier, setTier] = useState(null);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (token && u) {
      setUser(JSON.parse(u));
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/stakes/user`, {
        headers: { Authorization: token }
      })
        .then(res => res.json())
        .then(data => {
          const total = data.reduce((sum, s) => sum + s.amount, 0);
          setTier(getUserTier(total));
        });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center space-x-2 text-sm">
        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <span className="text-gray-700">{tier}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded text-sm text-gray-700 z-50">
          <a href="/dashboard/profile-summary" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
          <a href="/dashboard/wallet" className="block px-4 py-2 hover:bg-gray-100">Wallet</a>
          <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
        </div>
      )}
    </div>
  );
}
