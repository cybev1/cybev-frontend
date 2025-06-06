import { useState } from 'react';

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

  // ... include all functions: handleChange, handleLogoChange, renderNicheOptions, renderTemplates, etc.

  const renderTemplates = () => {
    const list = ['simple.png', 'elegant.png', 'crisp.png'];
    return (
      <div className="grid grid-cols-2 gap-4">
        {list.map((tpl, index) => (
          <div
            key={index}
            className={`border rounded-xl p-3 shadow hover:ring-2 cursor-pointer ${form.template === tpl ? 'ring-2 ring-blue-600' : ''}`}
            onClick={() => setForm(prev => ({ ...prev, template: tpl }))}
          >
            <img src={`/templates/${tpl}`} alt={tpl} className="w-full h-36 object-contain rounded mb-2 bg-white" />
            <p className="text-center text-sm">{tpl.replace('.png', '')}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">CYBEV Blog Setup (Steps 1–4)</h2>
      {step === 3 && renderTemplates()}
      <div className="mt-6 flex justify-between">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
        {step < 6 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
