
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
    { id: 'basic', name: 'Basic Plan', price: 5, type: 'Web Hosting', features: ['1 Website', '10GB SSD'] },
    { id: 'pro', name: 'Pro Plan', price: 10, type: 'Web Hosting', features: ['5 Sites', '50GB SSD'] },
    { id: 'vps', name: 'VPS Starter', price: 25, type: 'VPS Hosting', features: ['2 vCPU', '4GB RAM'] },
    { id: 'free', name: 'FREE HOSTING', price: 0, type: 'Free Hosting', features: ['500MB', 'SSL'], subdomainOnly: true }
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
    // Proceed to call /api/payment/initiate (backend handles Paystack/Cryptomus logic)
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Step 5: Hosting & Payment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{plan.type}</p>
            <p className="text-lg text-blue-600 mb-3">${plan.price}/month</p>
            <ul className="text-sm mb-4">
              {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <button
              className="bg-blue-600 text-white w-full py-2 rounded"
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
