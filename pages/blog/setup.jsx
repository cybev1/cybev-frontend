
import React, { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: '',
    existingDomain: '',
    newDomain: '',
    title: '',
    description: '',
    category: '',
    niche: '',
    template: '',
    monetize: false,
    hostingPlan: null,
    paymentMethod: 'paystack',
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const plans = [
    { id: 'basic', type: 'Web Hosting', name: 'Basic Plan', price: 5 },
    { id: 'pro', type: 'Web Hosting', name: 'Pro Plan', price: 10 },
    { id: 'premium', type: 'Web Hosting', name: 'Premium Plan', price: 20 },
    { id: 'vps_start', type: 'VPS Hosting', name: 'VPS Starter', price: 25 },
    { id: 'vps_standard', type: 'VPS Standard', name: 'VPS Standard', price: 40 },
    { id: 'vps_pro', type: 'VPS Hosting', name: 'VPS Pro', price: 70 },
    { id: 'free', type: 'Free Hosting', name: 'FREE HOSTING', price: 0, subdomainOnly: true },
  ];

  const goNext = () => setStep(prev => Math.min(prev + 1, 5));
  const goBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    if (plan.price === 0) {
      alert("Selected Free Hosting");
    } else {
      setShowModal(true);
    }
  };

  const handlePayment = () => {
    setShowModal(false);
    alert(\`Processing \${form.paymentMethod.toUpperCase()} payment for \${selectedPlan.name} ($\${selectedPlan.price})\`);
    window.location.href = "/blog/confirm";
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 1: Domain setup</h1>
          <input type="text" placeholder="Enter subdomain" className="border p-2 w-full" value={form.subdomain} onChange={(e) => setForm({ ...form, subdomain: e.target.value })} />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 2: Blog Identity</h1>
          <input type="text" placeholder="Title" className="border p-2 w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Description" className="border p-2 w-full mt-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </>
      );
    }
    if (step === 3) {
      return (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 3: Template + Monetize</h1>
          <select className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, template: e.target.value })}>
            <option value="">Select Template</option>
            <option value="Magazine">Magazine</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Creator">Creator</option>
          </select>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={form.monetize} onChange={(e) => setForm({ ...form, monetize: e.target.checked })} />
            <span>Enable Monetization</span>
          </label>
        </>
      );
    }
    if (step === 4) {
      return (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 4: Preview</h1>
          <p><strong>Subdomain:</strong> {form.subdomain}.cybev.io</p>
          <p><strong>Title:</strong> {form.title}</p>
          <p><strong>Description:</strong> {form.description}</p>
          <p><strong>Template:</strong> {form.template}</p>
          <p><strong>Monetization:</strong> {form.monetize ? "Yes" : "No"}</p>
        </>
      );
    }
    if (step === 5) {
      return (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 5: Hosting & Payment</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {plans.map(plan => (
              <div key={plan.id} className="border rounded-xl p-5 shadow hover:shadow-lg">
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-sm text-gray-500">{plan.type}</p>
                <p className="text-lg text-blue-700 font-semibold mb-2">${plan.price}</p>
                <button onClick={() => handlePlanSelect(plan)} className="w-full bg-blue-600 text-white py-2 rounded">Select Plan</button>
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow rounded">
      {renderStep()}
      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={goBack} className="bg-gray-300 px-4 py-2 rounded">Back</button>}
        {step < 5 && <button onClick={goNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Pay with {form.paymentMethod.toUpperCase()}</h2>
            <p>Selected Plan: <strong>{selectedPlan.name}</strong></p>
            <p>Amount: <strong>${selectedPlan.price}</strong></p>
            <button onClick={handlePayment} className="mt-4 w-full bg-green-600 text-white py-2 rounded">Proceed to Pay</button>
            <button onClick={() => setShowModal(false)} className="mt-2 w-full bg-gray-300 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
