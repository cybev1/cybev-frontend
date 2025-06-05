
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
    template: '',
    logo: null,
    monetize: false,
    hostingPlan: null,
  });

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const categoryNiches = {
    Christianity: ['Faith', 'Leadership', 'Prayer'],
    Business: ['Startups', 'Marketing'],
    Technology: ['AI', 'Web Dev']
  };

  const [niches, setNiches] = useState([]);
  useEffect(() => {
    if (form.category) {
      setNiches(categoryNiches[form.category] || []);
    }
  }, [form.category]);

  const renderStep3 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 3: Appearance</h1>
      <p className="text-gray-600 mb-4">Choose how your blog will look.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {['Magazine', 'Portfolio', 'Creator'].map((tpl, idx) => (
          <div
            key={idx}
            onClick={() => setForm(prev => ({ ...prev, template: tpl }))}
            className={`border rounded p-3 cursor-pointer hover:border-blue-500 ${form.template === tpl ? 'border-blue-600' : ''}`}
          >
            <img src={`/templates/${tpl.toLowerCase()}.jpg`} alt={tpl} className="w-full h-32 object-cover rounded mb-2" />
            <p className="text-center font-semibold">{tpl}</p>
          </div>
        ))}
      </div>

      <label className="block mb-2 font-medium">Upload Logo (optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm(prev => ({ ...prev, logo: e.target.files[0] }))}
        className="mb-4"
      />

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      {step === 3 && renderStep3()}
    </div>
  );
}
