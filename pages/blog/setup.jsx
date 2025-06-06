
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
  });

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const domainType = form.domainType || 'subdomain';

  const plans = [
    { id: 'basic', type: 'Web Hosting', name: 'Basic Plan', price: '$5/month', features: ['1 Website', '10GB SSD', 'Free SSL'] },
    { id: 'pro', type: 'Web Hosting', name: 'Pro Plan', price: '$10/month', features: ['5 Websites', '50GB SSD', 'Priority Support'] },
    { id: 'premium', type: 'Web Hosting', name: 'Premium Plan', price: '$20/month', features: ['Unlimited Sites', '200GB SSD', 'Daily Backup'] },
    { id: 'vps_start', type: 'VPS Hosting', name: 'VPS Starter', price: '$25/month', features: ['2 vCPU', '4GB RAM', '80GB SSD'] },
    { id: 'vps_standard', type: 'VPS Hosting', name: 'VPS Standard', price: '$40/month', features: ['4 vCPU', '8GB RAM', '160GB SSD'] },
    { id: 'vps_pro', type: 'VPS Hosting', name: 'VPS Pro', price: '$70/month', features: ['8 vCPU', '16GB RAM', '320GB SSD'] }
  ];

  const renderStep1 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 1: Choose Your Domain</h1>
      <select
        name="domainType"
        value={form.domainType}
        onChange={(e) => setForm({ ...form, domainType: e.target.value })}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="subdomain">Use Free Subdomain</option>
        <option value="existing">Use Existing Domain</option>
        <option value="register">Register New Domain</option>
      </select>
      <input
        type="text"
        placeholder="Your domain/subdomain"
        className="border p-2 rounded w-full"
        value={
          form.domainType === 'subdomain'
            ? form.subdomain
            : form.domainType === 'existing'
            ? form.existingDomain
            : form.newDomain
        }
        onChange={(e) =>
          setForm({
            ...form,
            [form.domainType === 'subdomain'
              ? 'subdomain'
              : form.domainType === 'existing'
              ? 'existingDomain'
              : 'newDomain']: e.target.value
          })
        }
      />
      <div className="flex justify-between mt-6">
        <span></span>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 2: Blog Identity</h1>
      <input
        name="title"
        placeholder="Blog Title"
        value={form.title}
        className="border p-2 rounded w-full mb-3"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        name="description"
        placeholder="SEO Blog Description"
        value={form.description}
        className="border p-2 rounded w-full mb-4"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 3: Choose Template</h1>
      <select
        name="template"
        value={form.template}
        onChange={(e) => setForm({ ...form, template: e.target.value })}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Select a Template</option>
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
      <h1 className="text-2xl font-bold mb-4">Step 4: Preview</h1>
      <div className="space-y-2">
        <p><strong>Domain:</strong> {form.domainType === 'subdomain' ? form.subdomain + '.cybev.io' : form.existingDomain || form.newDomain}</p>
        <p><strong>Title:</strong> {form.title}</p>
        <p><strong>Description:</strong> {form.description}</p>
        <p><strong>Template:</strong> {form.template}</p>
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
      </div>
    </>
  );

  const renderStep5 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 5: Hosting & Publish</h1>
      <p className="text-gray-600 mb-6">Choose a hosting or VPS plan for your blog, or skip to use free subdomain hosting.</p>

      {(domainType === 'existing' || domainType === 'register') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plans.map(plan => (
            <div key={plan.id} className="border rounded-xl p-5 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="text-sm text-gray-500">{plan.type}</p>
              <p className="text-lg font-semibold text-blue-700 mb-2">{plan.price}</p>
              <ul className="text-sm text-gray-700 mb-3">
                {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
              <button
                onClick={() => alert(`Selected ${plan.name}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {domainType === 'subdomain' && (
        <div className="text-center mt-6">
          <button
            onClick={() => alert('🎉 Blog published using free hosting!')}
            className="text-blue-700 underline text-lg"
          >
            👉 Skip this step and use free hosting
          </button>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
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
