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
    category: 'Christianity',
    niche: 'Devotionals',
    otherNiche: '',
    template: 'simple.png',
    logoPreview: '/logo-preview.png',
    monetize: true
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDomainInput = (e) => {
    const { name, value } = e.target;
    handleChange(e);
    if (typingTimeout) clearTimeout(typingTimeout);

    const domain = form.domainType === 'subdomain' ? `${value}.cybev.io` : value;

    const timeout = setTimeout(() => {
      if (!value) {
        setAvailabilityMsg('');
        return;
      }
      const isTaken = value.toLowerCase().includes("taken");
      setAvailabilityMsg(
        isTaken
          ? `❌ ${domain} is already taken.`
          : `✅ Congratulations! ${domain} is available.`
      );
    }, 500);
    setTypingTimeout(timeout);
  };

  const domain =
    form.domainType === 'subdomain'
      ? `${form.subdomain}.cybev.io`
      : form.domainType === 'existing'
      ? form.existingDomain
      : form.newDomain;

  const renderStep = () => {
    return (
      <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-4 transition-all duration-300">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold">Step 1: Domain Setup</h2>
            <select name="domainType" value={form.domainType} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="subdomain">Use Free Subdomain</option>
              <option value="existing">Use Existing Domain</option>
              <option value="register">Register New Domain</option>
            </select>
            <input
              name={form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain'}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter domain or subdomain"
              value={
                form.domainType === 'subdomain'
                  ? form.subdomain
                  : form.domainType === 'existing'
                  ? form.existingDomain
                  : form.newDomain
              }
              onChange={handleDomainInput}
            />
            {availabilityMsg && (
              <p className={`text-sm transition ${
                availabilityMsg.includes('✅') ? 'text-green-600' : 'text-red-600'
              }`}>
                {availabilityMsg}
              </p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold">Step 2: Blog Identity</h2>
            <input
              type="text"
              name="title"
              className="w-full border px-3 py-2 rounded"
              value={form.title}
              onChange={handleChange}
              placeholder="Blog Title"
            />
            <select name="category" className="w-full border px-3 py-2 rounded" value={form.category} onChange={handleChange}>
              <option value="Christianity">Christianity</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
            </select>
            <select name="niche" className="w-full border px-3 py-2 rounded" value={form.niche} onChange={handleChange}>
              <option value="Faith">Faith</option>
              <option value="Devotionals">Devotionals</option>
              <option value="Other">Other</option>
            </select>
            {form.niche === 'Other' && (
              <input
                type="text"
                name="otherNiche"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter your niche"
                value={form.otherNiche}
                onChange={handleChange}
              />
            )}
            <textarea
              name="description"
              className="w-full border px-3 py-2 rounded"
              value={form.description}
              placeholder="SEO Description"
              onChange={handleChange}
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Generate SEO</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold">Step 3: Design & Branding</h2>
            <img src={`/templates/${form.template}`} className="w-full h-32 object-contain rounded border" alt="Template" />
            <img src={form.logoPreview} className="h-16 mt-2 rounded" alt="Logo" />
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="monetize" checked={form.monetize} onChange={handleChange} />
              <span>Monetize Blog</span>
            </label>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Step 4: Blog Preview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl shadow">
                <h4 className="text-sm font-medium text-gray-500">Domain</h4>
                <p className="text-blue-700 font-semibold">{domain}</p>
              </div>
              <div className="p-4 border rounded-xl shadow">
                <h4 className="text-sm font-medium text-gray-500">Title</h4>
                <p className="text-gray-800 font-semibold">{form.title}</p>
              </div>
              <div className="p-4 border rounded-xl shadow">
                <h4 className="text-sm font-medium text-gray-500">Category & Niche</h4>
                <p className="text-gray-800">{form.category} — {form.niche === 'Other' ? form.otherNiche : form.niche}</p>
              </div>
              <div className="p-4 border rounded-xl shadow col-span-2">
                <h4 className="text-sm font-medium text-gray-500">SEO Description</h4>
                <p className="text-gray-700">{form.description}</p>
              </div>
              <div className="p-4 border rounded-xl shadow">
                <h4 className="text-sm font-medium text-gray-500">Template</h4>
                <img src={`/templates/${form.template}`} className="w-full h-32 object-contain mt-2 border rounded" alt="Template" />
              </div>
              <div className="p-4 border rounded-xl shadow">
                <h4 className="text-sm font-medium text-gray-500">Logo</h4>
                <img src={form.logoPreview} className="h-16 mt-2 bg-white rounded shadow" alt="Logo" />
              </div>
              <div className="p-4 border rounded-xl shadow">
                <h4 className="text-sm font-medium text-gray-500">Monetization</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  form.monetize ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                }`}>
                  {form.monetize ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {renderStep()}
      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
        {step < 5 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
