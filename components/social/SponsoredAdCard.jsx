
import React from 'react';

export default function SponsoredAdCard() {
  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-lg shadow-sm mb-4">
      <div className="text-xs uppercase font-bold text-yellow-600 mb-1">Sponsored</div>
      <div className="font-semibold text-sm mb-2">Boost Your Brand with CYBEV!</div>
      <img src="/sample-ad-banner.jpg" alt="Ad Banner" className="w-full h-32 object-cover rounded mb-2" />
      <a href="#" className="text-blue-600 text-sm underline hover:text-blue-800">Learn More</a>
    </div>
  );
}
