
import React, { useState } from 'react';

export default function AdsManager() {
  const [form, setForm] = useState({
    adTitle: '',
    adType: 'image',
    media: null,
    targetAudience: '',
    budget: '',
  });

  const [ads] = useState([
    { id: 1, title: 'CYBEV Launch Promo', type: 'Image', views: 3200, clicks: 280, status: 'Active' },
    { id: 2, title: 'Mint Your Blog Today', type: 'Video', views: 1450, clicks: 110, status: 'Paused' },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, media: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Ad submitted (simulate backend logic)');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">📢 Ads Manager</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input type="text" name="adTitle" placeholder="Ad Title" value={form.adTitle} onChange={handleChange} className="w-full p-2 border rounded" required />
        <select name="adType" value={form.adType} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="image">Image Ad</option>
          <option value="video">Video Ad</option>
          <option value="text">Text Ad</option>
        </select>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
        <input type="text" name="targetAudience" placeholder="Target Audience (e.g., bloggers, crypto fans)" value={form.targetAudience} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="budget" placeholder="Budget (CYBEV tokens)" value={form.budget} onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Launch Ad</button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">📊 Your Ads</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Views</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3">{ad.title}</td>
                <td className="p-3">{ad.type}</td>
                <td className="p-3">{ad.views}</td>
                <td className="p-3">{ad.clicks}</td>
                <td className="p-3 font-medium">{ad.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
