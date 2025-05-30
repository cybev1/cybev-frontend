
import React, { useEffect, useState } from 'react';
import StudioLayout from '../../components/layout/StudioLayout';
import axios from 'axios';
import Head from 'next/head';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – Admin Ad Review</title>
    <meta name="description" content="Review and approve or reject ad submissions on CYBEV.IO." />
  </Head>
);

export default function AdminAdsPanel() {
  const [ads, setAds] = useState([]);

  const fetchAds = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/ads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(res.data || []);
    } catch (err) {
      console.error('Failed to fetch ads', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/ads/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAds();
    } catch (err) {
      console.error('Failed to update ad status', err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <StudioLayout>
      <SeoHead />
      <h2 className="text-2xl font-bold mb-6">🛡 Admin: Review Ad Submissions</h2>
      <div className="space-y-4">
        {ads.map(ad => (
          <div key={ad._id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <p><strong>Title:</strong> {ad.title}</p>
            <p><strong>Description:</strong> {ad.description}</p>
            <p><strong>Budget:</strong> {ad.budget}</p>
            <p><strong>Status:</strong> <span className="capitalize">{ad.status}</span></p>
            <div className="space-x-2 mt-2">
              <button onClick={() => updateStatus(ad._id, 'approved')} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Approve</button>
              <button onClick={() => updateStatus(ad._id, 'rejected')} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </StudioLayout>
  );
}
