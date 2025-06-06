
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">CYBEV Blog Setup – Step {step} of 5</h1>
      {step === 4 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700">🌐 Preview Your Blog</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm">
              <p><strong>🌐 Domain:</strong> {getDomain()}</p>
              <p><strong>📝 Title:</strong> {form.title}</p>
              <p><strong>🧠 SEO Description:</strong> {form.description}</p>
              <p><strong>📂 Category:</strong> {form.category}</p>
              <p><strong>🔎 Niche:</strong> {form.niche}</p>
              <p><strong>💰 Monetization:</strong> {form.monetize ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-1">🖼️ Template Preview</p>
                <img
                  src={templatePreview[form.template]}
                  alt="Template Preview"
                  className="rounded-xl w-full border h-40 object-cover"
                />
              </div>
              <div>
                <p className="font-semibold mb-1">📛 Uploaded Logo</p>
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt="Uploaded Logo"
                    className="w-32 h-32 object-contain border rounded"
                  />
                ) : (
                  <div className="border rounded w-32 h-32 flex items-center justify-center text-gray-400 bg-gray-50">No Logo</div>
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
