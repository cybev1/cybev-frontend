
import React, { useState } from 'react';

export default function CYBEVMarketplace() {
  const [items] = useState([
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
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 CYBEV NFT & Content Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="w-full h-48 overflow-hidden rounded mb-3">
              {item.type === 'Video' ? (
                <video controls className="w-full h-full object-cover">
                  <source src={item.media} type="video/mp4" />
                </video>
              ) : (
                <img src={item.media} alt={item.title} className="w-full h-full object-cover" />
              )}
            </div>
            <h2 className="text-lg font-bold mb-1">{item.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Creator: {item.creator}</p>
            <p className="text-sm font-medium mt-2">Type: {item.type}</p>
            <p className="text-green-600 font-semibold text-lg mt-1">${item.price.toFixed(2)} CYBEV</p>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
