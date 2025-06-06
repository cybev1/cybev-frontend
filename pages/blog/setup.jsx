import { useState, useEffect } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(3);
  const [form, setForm] = useState({
    category: 'Christianity',
    template: '',
    logo: null,
    logoPreview: ''
  });

  const templates = {
    Christianity: ['faithful.png', 'grace.png', 'light.png'],
    Technology: ['codecraft.png', 'neon-ui.png', 'aitech.png'],
    Health: ['fitlife.png', 'wellnessplus.png', 'greenherb.png']
  };

  const handleTemplateSelect = (template) => {
    setForm(prev => ({ ...prev, template }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const renderTemplates = () => {
    const list = templates[form.category] || [];
    return (
      <div className="grid grid-cols-2 gap-4">
        {list.map((tpl, index) => (
          <div
            key={index}
            className={`border rounded-xl p-3 shadow hover:ring-2 cursor-pointer ${form.template === tpl ? 'ring-2 ring-blue-600' : ''}`}
            onClick={() => handleTemplateSelect(tpl)}
          >
            <img src={`/templates/${tpl}`} alt={tpl} className="w-full h-32 object-cover rounded mb-2" />
            <p className="text-center text-sm">{tpl.replace('.png', '').replace(/-/g, ' ')}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white/70 backdrop-blur-md shadow-md border border-gray-200 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Step 3: Design & Branding</h2>
          <p className="text-sm text-gray-600">This is how your website/blog will look like</p>
        </div>

        <div>
          <label className="block font-medium mb-2">Choose a Template</label>
          {renderTemplates()}
        </div>

        <div>
          <label className="block font-medium mb-1 mt-4">Upload Logo (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {form.logoPreview && (
            <img src={form.logoPreview} alt="Logo Preview" className="mt-4 h-20 rounded shadow" />
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
        {step < 6 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
