import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(4);
  const [form] = useState({
    domainType: 'subdomain',
    subdomain: 'myblog',
    existingDomain: '',
    newDomain: '',
    domainAvailable: true,
    title: 'Living Faith Daily',
    description: 'Discover insights and updates on Living Faith Daily – covering topics in Devotionals.',
    category: 'Christianity',
    niche: 'Devotionals',
    otherNiche: '',
    template: 'simple.png',
    logo: null,
    logoPreview: '/logo-preview.png',
    monetize: true
  });

  const domain =
    form.domainType === 'subdomain' ? `${form.subdomain}.cybev.io` :
    form.domainType === 'existing' ? form.existingDomain : form.newDomain;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-6 transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-4">Step 4: Blog Preview</h2>
        <p className="text-gray-600 mb-6 text-sm">Here’s what your blog setup looks like:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="p-4 border rounded-xl shadow hover:shadow-md transition">
            <h4 className="text-gray-500 font-medium">Domain</h4>
            <p className="text-blue-700 font-semibold mt-1">{domain}</p>
          </div>

          <div className="p-4 border rounded-xl shadow hover:shadow-md transition">
            <h4 className="text-gray-500 font-medium">Title</h4>
            <p className="text-gray-800 font-semibold mt-1">{form.title}</p>
          </div>

          <div className="p-4 border rounded-xl shadow hover:shadow-md transition">
            <h4 className="text-gray-500 font-medium">Category & Niche</h4>
            <p className="text-gray-800 mt-1">{form.category} — {form.niche}</p>
          </div>

          <div className="p-4 border rounded-xl shadow hover:shadow-md transition sm:col-span-2">
            <h4 className="text-gray-500 font-medium">SEO Description</h4>
            <p className="text-gray-700 mt-1">{form.description}</p>
          </div>

          <div className="p-4 border rounded-xl shadow hover:shadow-md transition">
            <h4 className="text-gray-500 font-medium">Selected Template</h4>
            <img src={`/templates/${form.template}`} alt="Template" className="w-full h-32 object-contain mt-2 border rounded" />
          </div>

          <div className="p-4 border rounded-xl shadow hover:shadow-md transition">
            <h4 className="text-gray-500 font-medium">Logo</h4>
            <img src={form.logoPreview} alt="Logo" className="h-16 mt-2 bg-white rounded shadow" />
          </div>

          <div className="p-4 border rounded-xl shadow hover:shadow-md transition">
            <h4 className="text-gray-500 font-medium">Monetization</h4>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
              form.monetize ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
            }`}>
              {form.monetize ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}
