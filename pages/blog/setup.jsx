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

  const domain =
    form.domainType === 'subdomain' ? `${form.subdomain}.cybev.io` :
    form.domainType === 'existing' ? form.existingDomain : form.newDomain;

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 1: Domain Setup</h2>
          <select className="w-full border px-3 py-2 rounded" value={form.domainType}>
            <option value="subdomain">Use Free Subdomain</option>
            <option value="existing">Use Existing Domain</option>
            <option value="register">Register New Domain</option>
          </select>
          <input
            type="text"
            placeholder="Enter domain or subdomain"
            className="w-full border px-3 py-2 rounded"
            value={
              form.domainType === 'subdomain' ? form.subdomain :
              form.domainType === 'existing' ? form.existingDomain : form.newDomain
            }
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
            placeholder="Blog Title"
            value={form.title}
            className="w-full border px-3 py-2 rounded"
          />
          <select className="w-full border px-3 py-2 rounded" value={form.category}>
            <option value="">Select Category</option>
            <option value="Christianity">Christianity</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
          </select>
          <input
            type="text"
            placeholder="Niche"
            value={form.niche}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            rows={3}
            placeholder="SEO Description"
            value={form.description}
            className="w-full border px-3 py-2 rounded"
          />
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
            <input type="checkbox" checked={form.monetize} />
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

    return <p className="text-gray-500">Unknown step</p>;
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
