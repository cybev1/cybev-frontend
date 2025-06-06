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
    otherNiche: '',
    template: 'simple.png',
    logoPreview: '/logo-preview.png',
    monetize: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateSEO = () => {
    const description = `Discover insights and updates on ${form.title || 'your blog'} covering topics in ${form.niche || 'your niche'}.`;
    setForm((prev) => ({
      ...prev,
      description
    }));
  };

  const domain =
    form.domainType === 'subdomain' ? `${form.subdomain}.cybev.io` :
    form.domainType === 'existing' ? form.existingDomain : form.newDomain;

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 1: Domain Setup</h2>
          <select name="domainType" className="w-full border px-3 py-2 rounded" value={form.domainType} onChange={handleChange}>
            <option value="subdomain">Use Free Subdomain</option>
            <option value="existing">Use Existing Domain</option>
            <option value="register">Register New Domain</option>
          </select>
          <input
            type="text"
            name={form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain'}
            placeholder="Enter domain or subdomain"
            className="w-full border px-3 py-2 rounded"
            value={
              form.domainType === 'subdomain' ? form.subdomain :
              form.domainType === 'existing' ? form.existingDomain : form.newDomain
            }
            onChange={handleChange}
          />
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 2: Blog Identity</h2>
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <select name="category" className="w-full border px-3 py-2 rounded" value={form.category} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Christianity">Christianity</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
          </select>
          <input
            type="text"
            name="niche"
            placeholder="Niche"
            value={form.niche}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            rows={3}
            placeholder="SEO Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={generateSEO}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Generate SEO
          </button>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 3: Design & Branding</h2>
          <img src={`/templates/${form.template}`} className="w-full h-32 object-contain rounded border" alt="Template" />
          <img src={form.logoPreview} className="h-16 mt-2 rounded" alt="Logo" />
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="monetize" checked={form.monetize} onChange={handleChange} />
            <span>Monetize Blog</span>
          </label>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="space-y-6 bg-white shadow-xl border border-gray-200 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold">Step 4: Blog Preview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 border rounded-xl shadow">
              <h4 className="text-sm text-gray-500 font-medium">Domain</h4>
              <p className="text-blue-700 font-semibold">{domain}</p>
            </div>
            <div className="p-4 border rounded-xl shadow">
              <h4 className="text-sm text-gray-500 font-medium">Title</h4>
              <p className="text-gray-800 font-semibold">{form.title}</p>
            </div>
            <div className="p-4 border rounded-xl shadow">
              <h4 className="text-sm text-gray-500 font-medium">Category & Niche</h4>
              <p className="text-gray-800">{form.category} — {form.niche}</p>
            </div>
            <div className="p-4 border rounded-xl shadow col-span-2">
              <h4 className="text-sm text-gray-500 font-medium">SEO Description</h4>
              <p className="text-gray-700">{form.description}</p>
            </div>
            <div className="p-4 border rounded-xl shadow">
              <h4 className="text-sm text-gray-500 font-medium">Template</h4>
              <img src={`/templates/${form.template}`} className="w-full h-32 object-contain border rounded mt-2" alt="Template" />
            </div>
            <div className="p-4 border rounded-xl shadow">
              <h4 className="text-sm text-gray-500 font-medium">Logo</h4>
              <img src={form.logoPreview} className="h-16 mt-2 bg-white rounded shadow" alt="Logo" />
            </div>
            <div className="p-4 border rounded-xl shadow">
              <h4 className="text-sm text-gray-500 font-medium">Monetization</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                form.monetize ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
              }`}>
                {form.monetize ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {renderStep()}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">
            Back
          </button>
        )}
        {step < 5 && (
          <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
