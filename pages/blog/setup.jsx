
import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(4);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: 'myblog',
    existingDomain: '',
    newDomain: '',
    title: 'My Awesome Blog',
    description: 'Auto-generated SEO description',
    category: 'Christianity',
    niche: 'Faith',
    template: 'minimal',
    logo: null,
    monetize: true,
  });

  const templatePreview = {
    minimal: '/templates/minimal.png',
    magazine: '/templates/magazine.png',
    portfolio: '/templates/portfolio.png',
  };

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const getDomain = () => {
    if (form.domainType === 'subdomain') return `${form.subdomain}.cybev.io`;
    if (form.domainType === 'existing') return form.existingDomain;
    return form.newDomain;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">CYBEV Blog Setup – Step {step} of 5</h1>
      {step === 4 && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Preview Your Blog</h2>
          <div className="grid gap-4">
            <div className="p-4 border rounded-xl shadow">
              <p><strong>Domain:</strong> {getDomain()}</p>
              <p><strong>Title:</strong> {form.title}</p>
              <p><strong>Description:</strong> {form.description}</p>
              <p><strong>Category:</strong> {form.category}</p>
              <p><strong>Niche:</strong> {form.niche}</p>
              <p><strong>Monetization:</strong> {form.monetize ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-2">Template Preview</p>
                <img
                  src={templatePreview[form.template]}
                  alt="Template Preview"
                  className="rounded-xl border w-full h-40 object-cover"
                />
              </div>
              <div>
                <p className="font-semibold mb-2">Uploaded Logo</p>
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt="Uploaded Logo"
                    className="w-32 h-32 object-contain border rounded"
                  />
                ) : (
                  <p className="text-gray-500">No logo uploaded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <button onClick={goNext} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}
