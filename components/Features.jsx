import React from 'react';

function Features() {
  const featureList = [
    "🚀 AI-powered blogging & SEO",
    "🔗 Web3 NFT minting and staking",
    "📊 Post earnings, ads & analytics",
    "🎥 Reels, Stories, Live, and more",
  ];

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {featureList.map((feature, idx) => (
          <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md text-lg">
            {feature}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
