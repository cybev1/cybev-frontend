
import React from 'react';

const DiscoveryCards = () => {
  const cards = [
    {
      title: '🔥 Trending Now',
      description: 'Check out the most popular posts this week',
      bg: 'bg-gray-50',
    },
    {
      title: '✨ Editor’s Pick',
      description: 'Handpicked content by our editorial team',
      bg: 'bg-green-50',
    },
    {
      title: '🚀 New Creators',
      description: 'Discover rising stars on CYBEV',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`flex-1 min-w-[200px] p-4 rounded-2xl shadow-md ${card.bg}`}
        >
          <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
          <p className="text-sm text-gray-600">{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default DiscoveryCards;
