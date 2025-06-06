
import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(5);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: '',
    existingDomain: '',
    newDomain: '',
    hostingPlan: null
  });

  const goBack = () => setStep(prev => prev - 1);
  const domainType = form.domainType || 'subdomain';

  const plans = [
    { id: 'basic', type: 'Web Hosting', name: 'Basic Plan', price: '$5/month', features: ['1 Website', '10GB SSD', 'Free SSL'] },
    { id: 'pro', type: 'Web Hosting', name: 'Pro Plan', price: '$10/month', features: ['5 Websites', '50GB SSD', 'Priority Support'] },
    { id: 'premium', type: 'Web Hosting', name: 'Premium Plan', price: '$20/month', features: ['Unlimited Sites', '200GB SSD', 'Daily Backup'] },
    { id: 'vps_start', type: 'VPS Hosting', name: 'VPS Starter', price: '$25/month', features: ['2 vCPU', '4GB RAM', '80GB SSD'] },
    { id: 'vps_standard', type: 'VPS Hosting', name: 'VPS Standard', price: '$40/month', features: ['4 vCPU', '8GB RAM', '160GB SSD'] },
    { id: 'vps_pro', type: 'VPS Hosting', name: 'VPS Pro', price: '$70/month', features: ['8 vCPU', '16GB RAM', '320GB SSD'] }
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Step 5: Hosting & Publish</h1>
      <p className="text-gray-600 mb-6">Choose a hosting or VPS plan for your blog, or skip to use free subdomain hosting.</p>

      {(domainType === 'existing' || domainType === 'register') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plans.map(plan => (
            <div key={plan.id} className="border rounded-xl p-5 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="text-sm text-gray-500">{plan.type}</p>
              <p className="text-lg font-semibold text-blue-700 mb-2">{plan.price}</p>
              <ul className="text-sm text-gray-700 mb-3">
                {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
              <button
                onClick={() => alert(`Selected ${plan.name}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {domainType === 'subdomain' && (
        <div className="text-center mt-6">
          <button
            onClick={() => alert('🎉 Blog published using free hosting!')}
            className="text-blue-700 underline text-lg"
          >
            👉 Skip this step and use free hosting
          </button>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
      </div>
    </div>
  );
}
