
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

  const renderStep1 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 1: Choose Your Domain</h1>
      <p className="text-gray-600 mb-4">This is how people will find you online.</p>

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
        <p className={`mt-2 text-sm ${availabilityMsg.includes('🎉') ? 'text-green-600' : 'text-red-600'}`}>
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
      <p className="text-gray-600 mb-4">This is your blog's name and details.</p>

      <input name="title" placeholder="Blog Title" className="border p-2 rounded w-full mb-2" onChange={handleChange} />
      <textarea name="description" placeholder="SEO Blog Description" className="border p-2 rounded w-full mb-4" onChange={handleChange} />

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 3: Appearance & Hosting</h1>
      <p className="text-gray-600 mb-4">This is how your website will look and work.</p>

      <select name="template" className="border p-2 rounded w-full mb-4" onChange={handleChange}>
        <option value="">Select Template</option>
        <option value="Magazine">Magazine</option>
        <option value="Portfolio">Portfolio</option>
        <option value="Creator">Creator</option>
      </select>

      <div className="flex items-center mb-4 space-x-2">
        <input type="checkbox" name="monetize" onChange={handleChange} />
        <label>Enable Blog Monetization (earn revenue with ads)</label>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
        <button onClick={() => console.log('Submitted:', form)} className="bg-green-600 text-white px-6 py-2 rounded">Finish & Publish</button>
      </div>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
