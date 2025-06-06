
import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(5);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    hostingPlan: null,
  });

  const goBack = () => setStep(prev => prev - 1);
  const handlePlanSelect = (plan) => {
    setForm({ ...form, hostingPlan: plan });
  };

  const handleSkip = () => {
    alert('Blog published using Free Hosting');
  };

  const handlePayment = (method) => {
    alert(`Proceeding to payment via ${method}`);
  };

  const hostingPlans = [
    { id: 'basic', name: 'Basic Hosting', price: '$10/mo', features: ['1 site', '10GB SSD', 'Free SSL'] },
    { id: 'pro', name: 'Pro Hosting', price: '$25/mo', features: ['10 sites', '100GB SSD', 'Priority Support'] },
    { id: 'elite', name: 'Elite Hosting', price: '$50/mo', features: ['Unlimited', '500GB SSD', 'Free Domain'] },
  ];

  const vpsPlans = [
    { id: 'vps1', name: 'VPS Starter', price: '$40/mo', features: ['2 vCPU', '4GB RAM', '80GB SSD'] },
    { id: 'vps2', name: 'VPS Business', price: '$70/mo', features: ['4 vCPU', '8GB RAM', '160GB SSD'] },
    { id: 'vps3', name: 'VPS Ultimate', price: '$120/mo', features: ['8 vCPU', '16GB RAM', '320GB SSD'] },
  ];

  const renderPlanCard = (plan) => (
    <div
      key={plan.id}
      className={`border rounded-xl shadow p-4 cursor-pointer ${form.hostingPlan === plan.id ? 'border-blue-600' : 'border-gray-300'}`}
      onClick={() => handlePlanSelect(plan.id)}
    >
      <h3 className="text-lg font-bold">{plan.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{plan.price}</p>
      <ul className="text-xs text-gray-500 space-y-1">
        {plan.features.map((f, i) => <li key={i}>- {f}</li>)}
      </ul>
      <div className="mt-3 flex gap-2">
        <button onClick={() => handlePayment('CYBV Token')} className="text-xs px-2 py-1 bg-yellow-300 rounded">CYBV</button>
        <button onClick={() => handlePayment('Paystack')} className="text-xs px-2 py-1 bg-green-500 text-white rounded">Paystack</button>
        <button onClick={() => handlePayment('Cryptomus')} className="text-xs px-2 py-1 bg-purple-500 text-white rounded">Cryptomus</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">CYBEV Blog Setup – Step {step} of 5</h1>
      <div className="grid gap-6">
        {form.domainType === 'subdomain' && (
          <div className="border p-4 rounded-2xl shadow bg-white">
            <h2 className="text-lg font-semibold mb-2">Free Hosting</h2>
            <p className="text-sm text-gray-600 mb-3">You are using a CYBEV subdomain. Enjoy free hosting for life.</p>
            <button onClick={handleSkip} className="px-4 py-2 bg-blue-600 text-white rounded">Publish with Free Hosting</button>
          </div>
        )}

        {form.domainType !== 'subdomain' && (
          <>
            <h2 className="text-xl font-semibold">Web Hosting Plans</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {hostingPlans.map(renderPlanCard)}
            </div>

            <h2 className="text-xl font-semibold mt-6">VPS Plans</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {vpsPlans.map(renderPlanCard)}
            </div>

            <div className="text-center mt-6">
              <button onClick={handleSkip} className="underline text-sm text-gray-500">Skip and Publish without Paid Hosting</button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
      </div>
    </div>
  );
}
