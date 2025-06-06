
import React, { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    title: '',
    description: '',
    template: '',
    hostingPlan: null,
    paymentMethod: '',
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const goNext = () => setStep(prev => Math.min(5, prev + 1));
  const goBack = () => setStep(prev => Math.max(1, prev - 1));

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
      alert('Free hosting selected. Blog will be published.');
    } else {
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    alert(
      "Processing " +
      form.paymentMethod.toUpperCase() +
      " for " +
      selectedPlan.name +
      " ($" +
      selectedPlan.price +
      ")"
    );
  };

  const renderStep1 = () => (
    <>
      <h2 className="text-xl font-bold mb-4">Step 1: Domain Type</h2>
      <select
        value={form.domainType}
        onChange={e => setForm({ ...form, domainType: e.target.value })}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="subdomain">Use Free Subdomain</option>
        <option value="existing">Use Existing Domain</option>
        <option value="register">Register New Domain</option>
      </select>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="text-xl font-bold mb-4">Step 2: Blog Identity</h2>
      <input
        placeholder="Blog Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        className="border p-2 rounded w-full mb-3"
      />
      <textarea
        placeholder="SEO Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        className="border p-2 rounded w-full mb-4"
      />
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 className="text-xl font-bold mb-4">Step 3: Template</h2>
      <select
        value={form.template}
        onChange={e => setForm({ ...form, template: e.target.value })}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Select Template</option>
        <option value="Magazine">Magazine</option>
        <option value="Portfolio">Portfolio</option>
        <option value="Creator">Creator</option>
      </select>
    </>
  );

  const renderStep4 = () => (
    <>
      <h2 className="text-xl font-bold mb-4">Step 4: Preview</h2>
      <p><strong>Domain:</strong> {form.domainType}</p>
      <p><strong>Title:</strong> {form.title}</p>
      <p><strong>Description:</strong> {form.description}</p>
      <p><strong>Template:</strong> {form.template}</p>
    </>
  );

  const renderStep5 = () => (
    <>
      <h2 className="text-xl font-bold mb-4">Step 5: Hosting & Payment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {plans.map(plan => (
          <div key={plan.id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <p className="text-sm text-gray-500">{plan.price === 0 ? 'FREE' : `$${plan.price}/month`}</p>
            <ul className="text-sm mb-2">{plan.features.map((f, i) => <li key={i}>• {f}</li>)}</ul>
            <button onClick={() => handlePlanSelect(plan)} className="bg-blue-600 text-white py-1 px-4 rounded w-full">Select Plan</button>
          </div>
        ))}
      </div>
      {showPayment && selectedPlan && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">Payment for {selectedPlan.name}</h4>
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
            disabled={!form.paymentMethod}
            onClick={handlePayment}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Pay ${selectedPlan.price}
          </button>
        </div>
      )}
    </>
  );

  const renderStep = () => {
    if (step === 1) return renderStep1();
    if (step === 2) return renderStep2();
    if (step === 3) return renderStep3();
    if (step === 4) return renderStep4();
    return renderStep5();
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
