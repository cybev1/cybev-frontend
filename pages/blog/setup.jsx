
import React, { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    title: '',
    description: '',
    template: '',
    hostingPlan: '',
    paymentMethod: '',
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const goNext = () => setStep(s => Math.min(5, s + 1));
  const goBack = () => setStep(s => Math.max(1, s - 1));

  const plans = [
    { id: 'basic', name: 'Basic Plan', price: 5, features: ['1 Site', '10GB SSD'] },
    { id: 'pro', name: 'Pro Plan', price: 10, features: ['5 Sites', '50GB SSD'] },
    { id: 'premium', name: 'Premium Plan', price: 20, features: ['Unlimited Sites', '200GB SSD'] },
    { id: 'vps_start', name: 'VPS Starter', price: 25, features: ['2 vCPU', '4GB RAM'] },
    { id: 'vps_standard', name: 'VPS Standard', price: 40, features: ['4 vCPU', '8GB RAM'] },
    { id: 'vps_pro', name: 'VPS Pro', price: 70, features: ['8 vCPU', '16GB RAM'] },
    { id: 'free', name: 'FREE HOSTING', price: 0, features: ['Subdomain Only', '500MB SSD'], subdomainOnly: true }
  ];

  const handlePlanSelect = (plan) => {
    if (plan.subdomainOnly && form.domainType !== 'subdomain') {
      alert('This plan is only available for subdomain users.');
      return;
    }
    setSelectedPlan(plan);
    setForm(prev => ({ ...prev, hostingPlan: plan.id }));
    if (plan.price === 0) {
      alert('Free hosting selected.');
    } else {
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    alert("Processing " + form.paymentMethod.toUpperCase() + " for " + selectedPlan.name + " ($" + selectedPlan.price + ")");
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <h2 className="text-xl font-bold mb-4">Step 1: Domain</h2>
          <select className="border p-2 rounded w-full mb-4" value={form.domainType} onChange={e => setForm({ ...form, domainType: e.target.value })}>
            <option value="subdomain">Use Free Subdomain</option>
            <option value="existing">Use Existing Domain</option>
            <option value="register">Register New Domain</option>
          </select>
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <h2 className="text-xl font-bold mb-4">Step 2: Identity</h2>
          <input className="border p-2 rounded w-full mb-3" placeholder="Blog Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="border p-2 rounded w-full mb-4" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </>
      );
    }
    if (step === 3) {
      return (
        <>
          <h2 className="text-xl font-bold mb-4">Step 3: Template</h2>
          <select className="border p-2 rounded w-full mb-4" value={form.template} onChange={e => setForm({ ...form, template: e.target.value })}>
            <option value="">Select Template</option>
            <option value="Magazine">Magazine</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Creator">Creator</option>
          </select>
        </>
      );
    }
    if (step === 4) {
      return (
        <>
          <h2 className="text-xl font-bold mb-4">Step 4: Preview</h2>
          <p><strong>Domain:</strong> {form.domainType}</p>
          <p><strong>Title:</strong> {form.title}</p>
          <p><strong>Description:</strong> {form.description}</p>
          <p><strong>Template:</strong> {form.template}</p>
        </>
      );
    }

    return (
      <>
        <h2 className="text-xl font-bold mb-4">Step 5: Hosting & Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {plans.map(plan => (
            <div key={plan.id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{plan.name}</h3>
              <p className="text-sm text-gray-600">{plan.price === 0 ? 'FREE' : `$${plan.price}/month`}</p>
              <ul className="text-sm mb-2">{plan.features.map((f, i) => <li key={i}>• {f}</li>)}</ul>
              <button onClick={() => handlePlanSelect(plan)} className="w-full bg-blue-600 text-white py-2 rounded">
                Select Plan
              </button>
            </div>
          ))}
        </div>

        {showPayment && selectedPlan && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-2">Pay for {selectedPlan.name}</h4>
            <select className="border p-2 rounded w-full mb-2" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
              <option value="">Select Payment Method</option>
              <option value="paystack">Paystack</option>
              <option value="cryptomus">Cryptomus</option>
            </select>
            <button disabled={!form.paymentMethod} onClick={handlePayment} className="bg-green-600 text-white px-4 py-2 rounded">
              Pay ${selectedPlan.price}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow rounded">
      {renderStep()}
      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={goBack} className="bg-gray-300 px-4 py-2 rounded">Back</button>}
        {step < 5 && <button onClick={goNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>}
      </div>
    </div>
  );
}
