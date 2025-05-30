
import StudioLayout from '../../components/layout/StudioLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Head from 'next/head';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – Dashboard</title>
    <meta name="description" content="Creator dashboard overview: earnings, ads, wallet, and more." />
  </Head>
);

export default function Dashboard() {
  const [adStats, setAdStats] = useState({ total: 0, pending: 0, approved: 0 });

  const fetchAdStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/ads/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ads = res.data || [];
      const counts = {
        total: ads.length,
        pending: ads.filter(a => a.status === 'pending').length,
        approved: ads.filter(a => a.status === 'approved').length
      };
      setAdStats(counts);
    } catch (err) {
      console.error('Failed to load ad stats', err);
    }
  };

  useEffect(() => {
    fetchAdStats();
  }, []);

  return (
    <StudioLayout>
      <SeoHead />
      <h1 className="text-3xl font-bold mb-4">Creator Studio Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h4 className="font-semibold">🧮 Total Ads</h4>
          <p className="text-xl">{adStats.total}</p>
        </div>
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded shadow">
          <h4 className="font-semibold">⏳ Pending Ads</h4>
          <p className="text-xl">{adStats.pending}</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded shadow">
          <h4 className="font-semibold">✅ Approved Ads</h4>
          <p className="text-xl">{adStats.approved}</p>
        </div>
      </div>
    </StudioLayout>
  );
}
