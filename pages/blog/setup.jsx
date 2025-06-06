
import React, { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    hostingPlan: '',
    paymentMethod: '',
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const plans = [
    { id: 'basic', name: 'Basic Plan', price: 5 },
    { id: 'pro', name: 'Pro Plan', price: 10 },
    { id: 'premium', name: 'Premium Plan', price: 20 },
    { id: 'vps_start', name: 'VPS Starter', price: 25 },
    { id: 'vps_standard', name: 'VPS Standard', price: 40 },
    { id: 'vps_pro', name: 'VPS Pro', price: 70 },
    { id: 'free', name: 'FREE HOSTING', price: 0, subdomainOnly: true }
  ];

  const goNext = () => setStep(prev => Math.min(5, prev + 1));
  const goBack = () => setStep(prev => Math.max(1, prev - 1));

  const handleSelect = (plan) => {
    if (plan.subdomainOnly && form.domainType !== 'subdomain') {
      alert("This plan is only available for subdomain users.");
      return;
    }
    setSelectedPlan(plan);
    setForm(prev => ({ ...prev, hostingPlan: plan.id }));
    if (plan.price === 0) {
      alert("Free hosting selected.");
    } else {
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    alert(
      "Processing " +
      form.paymentMethod.toUpperCase() +
      " payment for " +
      selectedPlan.name +
      " ($" +
      selectedPlan.price +
      ")"
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Step {step}: Hosting & Payment</h1>

      {step === 5 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {plans.map(plan => (
              <div key={plan.id} className="border p-4 rounded shadow">
                <h2 className="font-bold">{plan.name}</h2>
                <p className="text-blue-600">{plan.price === 0 ? 'FREE' : `$${plan.price}`}</p>
                <button onClick={() => handleSelect(plan)} className="mt-2 w-full bg-blue-600 text-white py-1 rounded">
                  Select Plan
                </button>
              </div>
            ))}
          </div>

          {showPayment && selectedPlan && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-2">Complete Payment</h3>
              <select
                value={form.paymentMethod}
                onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              >
                <option value="">Select Payment Method</option>
                <option value="paystack">Paystack</option>
                <option value="cryptomus">Cryptomus</option>
              </select>
              <button
                onClick={handlePayment}
                disabled={!form.paymentMethod}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Pay ${selectedPlan.price}
              </button>
            </div>
          )}
        </>
      )}

      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={goBack} className="bg-gray-300 px-4 py-2 rounded">Back</button>}
        {step < 5 && <button onClick={goNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>}
      </div>
    </div>
  );
}
