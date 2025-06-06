
import { useState } from 'react';

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
    logo: null,
    monetize: false,
    hostingPlan: null,
    paymentMethod: '',
  });

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const goNext = () => setStep(prev => prev + 1);
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

  const handlePlanSelect = (plan) => {
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
  };

  const renderStep1 = () => (
    <>
      <h1 className="text-xl font-bold mb-4">Step 1: Domain Setup</h1>
      <select value={form.domainType} onChange={e => setForm({ ...form, domainType: e.target.value })} className="border p-2 rounded w-full mb-3">
        <option value="subdomain">Use Free Subdomain</option>
        <option value="existing">Use Existing Domain</option>
        <option value="register">Register New Domain</option>
      </select>
      <input
        type="text"
        placeholder="Enter domain/subdomain"
        className="border p-2 rounded w-full mb-4"
        value={form.domainType === 'subdomain' ? form.subdomain : form.domainType === 'existing' ? form.existingDomain : form.newDomain}
        onChange={e => {
          const key = form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain';
          setForm({ ...form, [key]: e.target.value });
        }}
      />
      <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
    </>
  );

  const renderStep2 = () => (
    <>
      <h1 className="text-xl font-bold mb-4">Step 2: Blog Identity</h1>
      <input className="border p-2 rounded w-full mb-2" placeholder="Blog Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea className="border p-2 rounded w-full mb-4" placeholder="SEO Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h1 className="text-xl font-bold mb-4">Step 3: Select Template</h1>
      <select className="border p-2 rounded w-full mb-4" value={form.template} onChange={e => setForm({ ...form, template: e.target.value })}>
        <option value="">Choose a Template</option>
        <option value="Magazine">Magazine</option>
        <option value="Portfolio">Portfolio</option>
        <option value="Creator">Creator</option>
      </select>
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep4 = () => (
    <>
      <h1 className="text-xl font-bold mb-4">Step 4: Preview</h1>
      <p><strong>Domain:</strong> {form.domainType === 'subdomain' ? form.subdomain + '.cybev.io' : form.existingDomain || form.newDomain}</p>
      <p><strong>Title:</strong> {form.title}</p>
      <p><strong>Description:</strong> {form.description}</p>
      <p><strong>Template:</strong> {form.template}</p>
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
      </div>
    </>
  );

  const renderStep5 = () => (
    <>
      <h1 className="text-xl font-bold mb-4">Step 5: Hosting & Payment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {plans.map(plan => (
          <div key={plan.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-bold">{plan.name}</h2>
            <p className="text-sm text-gray-500">{plan.type}</p>
            <p className="text-blue-700 font-semibold text-md mb-2">${plan.price}/month</p>
            <ul className="text-sm mb-3">
              {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <button className="bg-blue-600 text-white w-full py-2 rounded" onClick={() => handlePlanSelect(plan)}>
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {showPayment && selectedPlan && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Payment for {selectedPlan.name}</h3>
          <select className="border p-2 rounded w-full mb-2" onChange={e => setForm({ ...form, paymentMethod: e.target.value })} value={form.paymentMethod}>
            <option value="">Select Payment Method</option>
            <option value="paystack">Paystack</option>
            <option value="cryptomus">Cryptomus</option>
          </select>
          <button disabled={!form.paymentMethod} className="bg-green-600 text-white px-4 py-2 rounded" onClick={handlePayment}>
            Proceed to Pay ${selectedPlan.price}
          </button>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="text-sm underline text-gray-700">← Back</button>
      </div>
    </>
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow rounded">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </div>
  );
}
