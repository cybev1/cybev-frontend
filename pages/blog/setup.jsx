
import React, { useState, useEffect } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: '',
    existingDomain: '',
    newDomain: '',
    domainAvailable: null,
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

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDomainInput = (e) => {
    const value = e.target.value;
    const domainKey = form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain';

    setForm(prev => ({
      ...prev,
      [domainKey]: value
    }));

    setAvailabilityMsg('');
    if (typingTimeout) clearTimeout(typingTimeout);

    const fullDomain = form.domainType === 'subdomain' ? `${value}.cybev.io` : value;

    setTypingTimeout(setTimeout(() => {
      fetch(`/api/hosting/domain-check?domain=${fullDomain}`)
        .then(res => res.json())
        .then(data => setAvailabilityMsg(data.message))
        .catch(() => setAvailabilityMsg("❌ Could not check domain."));
    }, 600));
  };

  const categoryNiches = {
    Christianity: ['Faith', 'Leadership', 'Prayer'],
    Business: ['Startups', 'Marketing'],
    Technology: ['AI', 'Web Dev']
  };

  const [niches, setNiches] = useState([]);
  useEffect(() => {
    if (form.category) {
      setNiches(categoryNiches[form.category] || []);
    }
  }, [form.category]);

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
    alert(\`🚀 Processing \${form.paymentMethod.toUpperCase()} payment for \${selectedPlan.name} ($\${selectedPlan.price})\`);
  };

  const renderStep1 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 1: Choose Your Domain</h1>
      <select name="domainType" onChange={handleChange} className="border p-2 rounded w-full mb-4" value={form.domainType}>
        <option value="subdomain">Use Free Subdomain</option>
        <option value="existing">Use Existing Domain</option>
        <option value="register">Register New Domain</option>
      </select>
      <input
        type="text"
        placeholder={form.domainType === 'subdomain' ? "Enter subdomain (e.g., myblog)" : "Enter your domain"}
        className="border p-2 rounded w-full"
        value={
          form.domainType === 'subdomain' ? form.subdomain :
          form.domainType === 'existing' ? form.existingDomain : form.newDomain
        }
        onChange={handleDomainInput}
      />
      {availabilityMsg && (
        <p className={\`mt-2 text-sm \${availabilityMsg.includes('🎉') ? 'text-green-600' : 'text-red-600'}\`}>
          {availabilityMsg}
        </p>
      )}
      <div className="flex justify-between mt-6">
        <span></span>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 2: Blog Identity</h1>
      <input name="title" placeholder="Blog Title" value={form.title} className="border p-2 rounded w-full mb-3" onChange={handleChange} />
      <textarea name="description" placeholder="SEO Blog Description" value={form.description} className="border p-2 rounded w-full mb-2" onChange={handleChange} />
      <button onClick={() => {
        const text = form.title
          ? \`Welcome to \${form.title}, your destination for engaging content and timeless insights.\`
          : 'Welcome to your new blog. Discover insightful content and share your voice with the world.';
        setForm(prev => ({ ...prev, description: text }));
      }} className="bg-indigo-600 text-white px-4 py-2 rounded mb-4">AI Generate Description</button>
      <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded w-full mb-3">
        <option value="">Select Category</option>
        {Object.keys(categoryNiches).map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
      </select>
      <select name="niche" value={form.niche} onChange={handleChange} className="border p-2 rounded w-full mb-4">
        <option value="">Select Niche</option>
        {niches.map((niche, i) => <option key={i} value={niche}>{niche}</option>)}
        <option value="Others">Others</option>
      </select>
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 3: Appearance & Hosting</h1>
      <select name="template" value={form.template} onChange={handleChange} className="border p-2 rounded w-full mb-4">
        <option value="">Select Template</option>
        <option value="Magazine">Magazine</option>
        <option value="Portfolio">Portfolio</option>
        <option value="Creator">Creator</option>
      </select>
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep4 = () => {
    const domain = form.domainType === 'subdomain'
      ? `${form.subdomain}.cybev.io`
      : form.domainType === 'existing'
      ? form.existingDomain
      : form.newDomain;

    return (
      <>
        <h1 className="text-2xl font-bold mb-4">Step 4: Preview</h1>
        <div className="border p-4 rounded bg-gray-50 space-y-3">
          <div><strong>Domain:</strong> {domain}</div>
          <div><strong>Title:</strong> {form.title}</div>
          <div><strong>Description:</strong> {form.description}</div>
          <div><strong>Category:</strong> {form.category}</div>
          <div><strong>Niche:</strong> {form.niche}</div>
          <div><strong>Template:</strong> {form.template}</div>
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
          <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
        </div>
      </>
    );
  };

  const renderStep5 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 5: Hosting & Payment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {plans.map(plan => (
          <div key={plan.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-bold">{plan.name}</h2>
            <p className="text-sm text-gray-500">{plan.type}</p>
            <p className="text-blue-700 font-semibold mb-2">{plan.price === 0 ? 'FREE' : `$${plan.price}/month`}</p>
            <ul className="text-sm mb-3">{plan.features.map((f, i) => <li key={i}>• {f}</li>)}</ul>
            <button onClick={() => handlePlanSelect(plan)} className="bg-blue-600 text-white py-2 rounded w-full">
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {showPayment && selectedPlan && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Pay for {selectedPlan.name}</h3>
          <select value={form.paymentMethod} onChange={handleChange} name="paymentMethod" className="border p-2 rounded w-full mb-2">
            <option value="">Select Payment Method</option>
            <option value="paystack">Paystack</option>
            <option value="cryptomus">Cryptomus</option>
          </select>
          <button disabled={!form.paymentMethod} onClick={handlePayment} className="bg-green-600 text-white px-6 py-2 rounded">
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
