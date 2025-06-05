
import React from 'react';

const hostingPlans = [
  {
    id: 'web_starter',
    type: 'Web Hosting',
    name: 'Starter',
    price: '$5/month',
    features: ['1 Website', '10GB SSD Storage', 'Free SSL', '1 Email Account'],
  },
  {
    id: 'web_pro',
    type: 'Web Hosting',
    name: 'Pro',
    price: '$10/month',
    features: ['10 Websites', '50GB SSD', 'Free SSL & CDN', '10 Emails'],
  },
  {
    id: 'web_unlimited',
    type: 'Web Hosting',
    name: 'Unlimited',
    price: '$15/month',
    features: ['Unlimited Websites', '100GB SSD', 'Free Backups', 'Unlimited Emails'],
  },
  {
    id: 'vps_basic',
    type: 'VPS Hosting',
    name: 'VPS Basic',
    price: '$25/month',
    features: ['2 vCPU', '4GB RAM', '80GB SSD', '1TB Bandwidth'],
  },
  {
    id: 'vps_standard',
    type: 'VPS Hosting',
    name: 'VPS Standard',
    price: '$40/month',
    features: ['4 vCPU', '8GB RAM', '160GB SSD', '2TB Bandwidth'],
  },
  {
    id: 'vps_pro',
    type: 'VPS Hosting',
    name: 'VPS Pro',
    price: '$70/month',
    features: ['8 vCPU', '16GB RAM', '320GB SSD', '4TB Bandwidth'],
  },
];

export default function Step5() {
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Step 5 – Hosting Plan Selection</h1>
      <p className="mb-6 text-gray-600">Choose a hosting plan or skip to publish your blog for free.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostingPlans.map(plan => (
          <div key={plan.id} className="border rounded-xl p-4 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{plan.type}</p>
            <p className="text-lg font-bold mb-3">{plan.price}</p>
            <ul className="text-sm text-gray-700 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Select Plan
            </button>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <button className="text-blue-600 underline hover:text-blue-800">
          Skip & Publish Without Hosting Plan
        </button>
      </div>
    </div>
  );
}
