
import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(5);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    hostingPlan: null,
    paymentMethod: '',
  });
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const goBack = () => setStep(prev => prev - 1);

  const plans = [
    { id: 'basic', name: 'Basic Plan', price: 5, type: 'Web Hosting', features: ['1 Website', '10GB SSD', 'Free SSL'] },
    { id: 'pro', name: 'Pro Plan', price: 10, type: 'Web Hosting', features: ['5 Websites', '50GB SSD', 'Priority Support'] },
    { id: 'premium', name: 'Premium Plan', price: 20, type: 'Web Hosting', features: ['Unlimited Sites', '200GB SSD', 'Daily Backup'] },
    { id: 'vps_start', name: 'VPS Starter', price: 25, type: 'VPS Hosting', features: ['2 vCPU', '4GB RAM', '80GB SSD'] },
    { id: 'vps_standard', name: 'VPS Standard', price: 40, type: 'VPS Hosting', features: ['4 vCPU', '8GB RAM', '160GB SSD'] },
    { id: 'vps_pro', name: 'VPS Pro', price: 70, type: 'VPS Hosting', features: ['8 vCPU', '16GB RAM', '320GB SSD'] },
    { id: 'free', name: 'FREE HOSTING', price: 0, type: 'Free Hosting', features: ['Subdomain Only', '500MB Storage', 'Free SSL'], subdomainOnly: true }
  ];

  const handleSelect = (plan) => {
    if (plan.subdomainOnly && form.domainType !== 'subdomain') {
      alert('❌ This plan is only available for subdomain users.');
      return;
    }

    setSelectedPlan(plan);
    setForm(prev => ({ ...prev, hostingPlan: plan.id }));

    if (plan.price === 0) {
      alert('🎉 Free hosting selected. Blog will be published.');
    } else {
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    alert(`🚀 Processing ${form.paymentMethod.toUpperCase()} payment for ${selectedPlan.name} ($${selectedPlan.price})`);
    // TODO: call /api/payment/initiate
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Step 5: Hosting & Payment</h1>
      <p className="text-gray-600 mb-6">Select a hosting plan or continue with free hosting if using a subdomain.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {plans.map(plan => (
          <div key={plan.id} className="border p-5 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-sm text-gray-500">{plan.type}</p>
            <p className="text-lg text-blue-700 font-semibold mb-2">${plan.price}/month</p>
            <ul className="text-sm text-gray-700 mb-4">
              {plan.features.map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              onClick={() => handleSelect(plan)}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {showPayment && selectedPlan && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Complete Payment for {selectedPlan.name}</h3>
          <select
            className="border p-2 rounded w-full mb-3"
            onChange={(e) => setForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
            value={form.paymentMethod}
          >
            <option value="">Select Payment Method</option>
            <option value="paystack">Paystack</option>
            <option value="cryptomus">Cryptomus</option>
          </select>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded"
            disabled={!form.paymentMethod}
            onClick={handlePayment}
          >
            Proceed to Pay ${selectedPlan.price}
          </button>
        </div>
      )}

      <div className="mt-6">
        <button onClick={goBack} className="text-sm underline text-gray-700">← Back</button>
      </div>
    </div>
  );
}
