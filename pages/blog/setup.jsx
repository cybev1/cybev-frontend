
import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(3);
  const [form, setForm] = useState({
    template: '',
    logo: null,
    monetize: false,
  });

  const templates = [
    { id: 'minimal', name: 'Minimalist', preview: '/templates/minimal.png' },
    { id: 'magazine', name: 'Magazine', preview: '/templates/magazine.png' },
    { id: 'portfolio', name: 'Portfolio', preview: '/templates/portfolio.png' }
  ];

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleTemplateSelect = (id) => {
    setForm({ ...form, template: id });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, logo: URL.createObjectURL(file) });
    }
  };

  const handleMonetizeToggle = () => {
    setForm(prev => ({ ...prev, monetize: !prev.monetize }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">CYBEV Blog Setup – Step {step} of 5</h1>
      {step === 3 && (
        <div className="grid gap-6 bg-white p-6 rounded-2xl shadow">
          <div>
            <h2 className="font-semibold text-lg mb-2">Choose a Template</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className={`border rounded-xl p-2 cursor-pointer ${form.template === tpl.id ? 'border-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleTemplateSelect(tpl.id)}
                >
                  <img src={tpl.preview} alt={tpl.name} className="rounded w-full h-28 object-cover" />
                  <p className="text-center mt-2">{tpl.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-1">Upload Logo (optional)</h2>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
            {form.logo && <img src={form.logo} alt="Logo Preview" className="mt-2 w-32 h-32 object-contain rounded border" />}
          </div>

          <div className="flex items-center space-x-3">
            <input type="checkbox" checked={form.monetize} onChange={handleMonetizeToggle} />
            <label className="font-medium">Enable Monetization</label>
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
