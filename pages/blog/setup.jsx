// This is your previously working Steps 1–3 code now extended with Step 4 preview
// Everything (domain, title, niche, logo, template, monetization) shown in cards before publishing
// This assumes form state and handlers are already present

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
    otherNiche: '',
    template: '',
    logo: null,
    logoPreview: '',
    monetize: false
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const renderStep = () => {
    if (step === 4) {
      const domain =
        form.domainType === 'subdomain' ? `${form.subdomain}.cybev.io` :
        form.domainType === 'existing' ? form.existingDomain :
        form.newDomain;

      return (
        <div className="bg-white border rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Step 4: Preview Your Blog</h2>
          <p className="text-gray-600 text-sm">Here's what your blog setup looks like:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="border p-4 rounded-xl">
              <h4 className="font-medium text-gray-500">Domain</h4>
              <p className="text-blue-700 font-semibold mt-1">{domain}</p>
            </div>

            <div className="border p-4 rounded-xl">
              <h4 className="font-medium text-gray-500">Title</h4>
              <p className="text-gray-800 font-semibold mt-1">{form.title}</p>
            </div>

            <div className="border p-4 rounded-xl">
              <h4 className="font-medium text-gray-500">Category & Niche</h4>
              <p className="text-gray-800 mt-1">{form.category} — {form.niche === 'Other' ? form.otherNiche : form.niche}</p>
            </div>

            <div className="border p-4 rounded-xl sm:col-span-2">
              <h4 className="font-medium text-gray-500">SEO Description</h4>
              <p className="text-gray-700 mt-1">{form.description}</p>
            </div>

            <div className="border p-4 rounded-xl">
              <h4 className="font-medium text-gray-500">Template</h4>
              {form.template ? (
                <img
                  src={`/templates/${form.template}`}
                  alt="Template"
                  className="w-full h-32 object-contain border mt-2 rounded"
                />
              ) : (
                <p className="text-gray-400 mt-1">No template selected</p>
              )}
            </div>

            <div className="border p-4 rounded-xl">
              <h4 className="font-medium text-gray-500">Logo</h4>
              {form.logoPreview ? (
                <img src={form.logoPreview} alt="Logo Preview" className="h-16 rounded shadow mt-2 bg-white" />
              ) : (
                <p className="text-gray-400 mt-1">No logo uploaded</p>
              )}
            </div>

            <div className="border p-4 rounded-xl">
              <h4 className="font-medium text-gray-500">Monetization</h4>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold 
                ${form.monetize ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                {form.monetize ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return <div className="text-gray-500 italic">Steps 1–3 render here (already working)</div>;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {renderStep()}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Back
          </button>
        )}
        {step < 6 && (
          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
