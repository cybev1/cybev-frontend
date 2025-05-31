
import React, { useState } from 'react';

export default function CYBEVMarketplace() {
  const [filter, setFilter] = useState({ type: '', priceRange: '' });
  const items = [
    {
      id: 1,
      title: 'Faith-Based NFT Article',
      creator: 'PrinceD',
      price: 12.5,
      type: 'Article',
      media: '/uploads/sample1.jpg',
    },
    {
      id: 2,
      title: 'Crypto Dev eBook NFT',
      creator: 'TechGuru',
      price: 18.9,
      type: 'eBook',
      media: '/uploads/sample2.jpg',
    },
    {
      id: 3,
      title: 'Minted Video Testimony',
      creator: 'GraceN',
      price: 24.0,
      type: 'Video',
      media: '/uploads/sample2.mp4',
    },
  ];

  const filteredItems = items.filter((item) => {
    const matchType = filter.type ? item.type === filter.type : true;
    const matchPrice =
      filter.priceRange === 'low' ? item.price <= 15 :
      filter.priceRange === 'mid' ? item.price > 15 && item.price <= 20 :
      filter.priceRange === 'high' ? item.price > 20 : true;
    return matchType && matchPrice;
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto mt-8">
      <aside className="md:w-1/4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <label className="block mb-2 text-sm font-medium">Content Type</label>
        <select
          className="w-full p-2 mb-4 border rounded"
          value={filter.type}
          onChange={(e) => setFilter((prev) => ({ ...prev, type: e.target.value }))}
        >
          <option value="">All</option>
          <option value="Article">Article</option>
          <option value="eBook">eBook</option>
          <option value="Video">Video</option>
        </select>

        <label className="block mb-2 text-sm font-medium">Price Range</label>
        <select
          className="w-full p-2 border rounded"
          value={filter.priceRange}
          onChange={(e) => setFilter((prev) => ({ ...prev, priceRange: e.target.value }))}
        >
          <option value="">All</option>
          <option value="low">0 - 15 CYBEV</option>
          <option value="mid">15 - 20 CYBEV</option>
          <option value="high">20+ CYBEV</option>
        </select>
      </aside>

      <main className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
            <div className="w-full h-48 overflow-hidden rounded mb-3">
              {item.type === 'Video' ? (
                <video controls className="w-full h-full object-cover">
                  <source src={item.media} type="video/mp4" />
                </video>
              ) : (
                <img src={item.media} alt={item.title} className="w-full h-full object-cover" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">Creator: {item.creator}</p>
            <p className="text-sm font-medium">Type: {item.type}</p>
            <p className="text-green-600 font-semibold mt-1">${item.price.toFixed(2)} CYBEV</p>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Buy Now</button>
          </div>
        ))}
      </main>
    </div>
  );
}
