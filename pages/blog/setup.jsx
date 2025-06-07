
import { useState, useEffect } from 'react';

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
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const categories = ['Christianity', 'Technology', 'Health', 'Education'];
  const allNiches = {
    Christianity: ['Faith', 'Evangelism', 'Church Growth'],
    Technology: ['AI', 'Web Development', 'Blockchain'],
    Health: ['Nutrition', 'Fitness', 'Mental Health'],
    Education: ['E-learning', 'Study Tips', 'Scholarships'],
  };

  const templatePreview = {
    minimal: '/templates/minimal.png',
    magazine: '/templates/magazine.png',
    portfolio: '/templates/portfolio.png',
  };

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'subdomain' || name === 'existingDomain' || name === 'newDomain') {
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(() => {
        setAvailabilityMsg('🎉 Domain is available');
        setForm((prev) => ({ ...prev, domainAvailable: true }));
      }, 800));
    }

    if (name === 'category') {
      const updatedNiches = allNiches[value] || [];
      setForm((prev) => ({ ...prev, niche: '', category: value }));
    }
  };

  const handleGenerateDescription = () => {
    setForm((prev) => ({
      ...prev,
      description: `Welcome to ${prev.title}, your trusted destination for ${prev.category} insights and inspiration.`,
    }));
  };

  const handleTemplateSelect = (id) => {
    setForm({ ...form, template: id });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, logo: URL.createObjectURL(file) });
    }
  };

  const handleMonetizeToggle = () => {
    setForm((prev) => ({ ...prev, monetize: !prev.monetize }));
  };

  const getDomain = () => {
    if (form.domainType === 'subdomain') return `${form.subdomain}.cybev.io`;
    if (form.domainType === 'existing') return form.existingDomain;
    return form.newDomain;
  };

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
      className={`border rounded-xl shadow p-4 cursor-pointer \${form.hostingPlan === plan.id ? 'border-blue-600' : 'border-gray-300'}`}
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

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow p-6">
          <label className="block">Domain Type:</label>
          <select
            name="domainType"
            value={form.domainType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="subdomain">Use a free subdomain</option>
            <option value="existing">Use an existing domain</option>
            <option value="register">Register a new domain</option>
          </select>

          {form.domainType === 'subdomain' && (
            <>
              <label className="block mt-4">Enter Subdomain:</label>
              <input type="text" name="subdomain" className="w-full p-2 border rounded" value={form.subdomain} onChange={handleChange} />
              {form.domainAvailable && <p className="text-green-600 mt-2">{availabilityMsg}</p>}
            </>
          )}
          {form.domainType === 'existing' && (
            <>
              <label className="block mt-4">Enter Your Existing Domain:</label>
              <input type="text" name="existingDomain" className="w-full p-2 border rounded" value={form.existingDomain} onChange={handleChange} />
              {form.domainAvailable && <p className="text-green-600 mt-2">{availabilityMsg}</p>}
            </>
          )}
          {form.domainType === 'register' && (
            <>
              <label className="block mt-4">Register New Domain:</label>
              <input type="text" name="newDomain" className="w-full p-2 border rounded" value={form.newDomain} onChange={handleChange} />
              {form.domainAvailable && <p className="text-green-600 mt-2">{availabilityMsg}</p>}
            </>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div>
            <label className="block mb-1">Blog Title</label>
            <input type="text" name="title" className="w-full p-2 border rounded" value={form.title} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1">SEO Description</label>
            <textarea name="description" className="w-full p-2 border rounded" rows="3" value={form.description} onChange={handleChange} />
            <button onClick={handleGenerateDescription} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">AI Generate SEO</button>
          </div>
          <div>
            <label className="block mb-1">Category</label>
            <select name="category" className="w-full p-2 border rounded" value={form.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Niche</label>
            <select name="niche" className="w-full p-2 border rounded" value={form.niche} onChange={handleChange}>
              <option value="">Select Niche</option>
              {(allNiches[form.category] || []).map((n, idx) => <option key={idx} value={n}>{n}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-6 bg-white p-6 rounded-2xl shadow">
          <div>
            <h2 className="font-semibold text-lg mb-2">Choose a Template</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.keys(templatePreview).map((id) => (
                <div key={id} className={`border rounded-xl p-2 cursor-pointer \${form.template === id ? 'border-blue-500' : 'border-gray-300'}`} onClick={() => handleTemplateSelect(id)}>
                  <img src={templatePreview[id]} alt={id} className="rounded w-full h-28 object-cover" />
                  <p className="text-center mt-2 capitalize">{id}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-1">Upload Logo (optional)</h2>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
            {form.logo && <img src={form.logo} alt="Logo Preview" className="mt-2 w-32 h-32 object-contain rounded border" />}
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" checked={form.monetize} onChange={handleMonetizeToggle} />
            <label className="font-medium">Enable Monetization</label>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Preview Your Blog</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm">
              <p><strong>Domain:</strong> {getDomain()}</p>
              <p><strong>Title:</strong> {form.title}</p>
              <p><strong>SEO Description:</strong> {form.description}</p>
              <p><strong>Category:</strong> {form.category}</p>
              <p><strong>Niche:</strong> {form.niche}</p>
              <p><strong>Monetization:</strong> {form.monetize ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-1">Template Preview</p>
                <img src={templatePreview[form.template]} alt="Template Preview" className="rounded-xl w-full border h-40 object-cover" />
              </div>
              <div>
                <p className="font-semibold mb-1">Uploaded Logo</p>
                {form.logo ? (
                  <img src={form.logo} alt="Uploaded Logo" className="w-32 h-32 object-contain border rounded" />
                ) : (
                  <div className="border rounded w-32 h-32 flex items-center justify-center text-gray-400 bg-gray-50">No Logo</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
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
      )}

      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={goBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>}
        {step < 5 && <button onClick={goNext} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
