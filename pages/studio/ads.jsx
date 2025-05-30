import React, { useState, useEffect } from 'react';
import StudioLayout from '../../components/layout/StudioLayout';
import axios from 'axios';
import Head from 'next/head';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – Ads Manager</title>
    <meta name="description" content="Launch and manage ads on the CYBEV.IO platform. Submit banners, budget and media for promotion." />
    <meta property="og:title" content="CYBEV.IO – Ads Dashboard" />
    <meta property="og:image" content="https://app.cybev.io/og-banner.png" />
  </Head>
);

export default function AdsManager() {
  const [form, setForm] = useState({
    title: '', description: '', mediaUrl: '', budget: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myAds, setMyAds] = useState([]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      await axios.post('/api/ads', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
      setForm({ title: '', description: '', mediaUrl: '', budget: '' });
      fetchMyAds();
    } catch (err) {
      alert('Ad submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMyAds = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/ads/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyAds(res.data || []);
    } catch (err) {
      console.error('Failed to fetch ads', err);
    }
  };

  useEffect(() => {
    fetchMyAds();
  }, []);

  return (
    <StudioLayout>
      <SeoHead />
      <h2 className="text-2xl font-bold mb-4">📢 CYBEV Ads Manager</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Ad Title" value={form.title} onChange={handleChange} required className="input" />
        <textarea name="description" placeholder="Ad Description" value={form.description} onChange={handleChange} required className="input" />
        <input type="text" name="mediaUrl" placeholder="Media URL" value={form.mediaUrl} onChange={handleChange} required className="input" />
        <input type="number" name="budget" placeholder="Budget in CYBEV Tokens" value={form.budget} onChange={handleChange} required className="input" />
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Submitting...' : 'Create Ad'}
        </button>
      </form>

      {submitted && (
        <div className="mt-6 text-green-600 font-semibold">
          ✅ Ad Submitted Successfully!
        </div>
      )}

      {myAds.length > 0 && (
        <div className="mt-10">
          <h3 className="font-bold text-xl mb-2">Your Submitted Ads</h3>
          <ul className="space-y-4">
            {myAds.map(ad => (
              <li key={ad._id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                <p><strong>Title:</strong> {ad.title}</p>
                <p><strong>Status:</strong> <span className="capitalize">{ad.status}</span></p>
                <p><strong>Budget:</strong> {ad.budget} CYBEV</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </StudioLayout>
  );
}
