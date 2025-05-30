
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function CreatorDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/register');

      try {
        const res = await axios.get('/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch (err) {
        router.push('/register');
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to CYBEV Creator Studio, {user.name}</h2>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {user.features.hasTimeline && <div className="card">📱 Social Timeline</div>}
        {user.features.hasBlog && <div className="card">📝 My Blog</div>}
        {user.features.hasNFT && <div className="card">🎨 NFT Marketplace</div>}
        {user.features.isCMSAdmin && <div className="card">👥 Community Management</div>}
        {user.features.hasUtilityAccess && <div className="card">💼 Utility Services</div>}
        <div className="card">💰 Wallet & Earnings</div>
        <div className="card">📢 Ads Manager</div>
        <div className="card">🧠 AI Tools</div>
      </div>
    </div>
  );
}
