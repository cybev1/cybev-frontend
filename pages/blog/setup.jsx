
import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(5); // Start at step 5 for demo

  const hostingPlans = [
    {
      id: 'web_starter',
      type: 'Web Hosting',
      name: 'Starter',
      price: '$5/month',
      features: ['1 Website', '10GB SSD', 'Free SSL', '1 Email'],
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

  const handlePlanSelect = (planId) => {
    alert(`Selected plan: ${planId}`);
  };

  const skipAndPublish = () => {
    alert('🎉 Blog published using free hosting!');
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-2">Step 5: Hosting & Publish</h1>
      <p className="text-gray-600 mb-6">Choose a hosting or VPS plan for your blog, or skip to use free subdomain hosting.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {hostingPlans.map((plan) => (
          <div key={plan.id} className="border rounded-xl p-5 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{plan.type}</p>
            <p className="text-lg font-semibold text-blue-700 mb-3">{plan.price}</p>
            <ul className="text-sm text-gray-700 mb-4">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanSelect(plan.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          onClick={skipAndPublish}
          className="text-blue-600 underline text-lg hover:text-blue-800"
        >
          👉 Skip this step and use free hosting
        </button>
      </div>
    </div>
  );
}
