
import { useState } from 'react';

export default function BlogSetupSteps() {
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

  const renderStep1 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 1: Choose Your Domain</h1>
      <p className="text-gray-600 mb-4">This is how people will find you online.</p>

      <select name="domainType" onChange={handleChange} className="border p-2 rounded w-full mb-4">
        <option value="subdomain">Use Free Subdomain</option>
        <option value="existing">Use Existing Domain</option>
        <option value="register">Register New Domain</option>
      </select>

      {form.domainType === 'subdomain' && (
        <input name="subdomain" placeholder="yourname (will become yourname.cybev.io)" className="border p-2 rounded w-full" onChange={handleChange} />
      )}
      {form.domainType === 'existing' && (
        <input name="existingDomain" placeholder="yourdomain.com" className="border p-2 rounded w-full" onChange={handleChange} />
      )}
      {form.domainType === 'register' && (
        <input name="newDomain" placeholder="searchdomain.com" className="border p-2 rounded w-full" onChange={handleChange} />
      )}

      <div className="flex justify-between mt-6">
        <span></span>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 2: Blog Identity</h1>
      <p className="text-gray-600 mb-4">This is your blog name and what people will call it.</p>

      <input name="title" placeholder="Blog Title" className="border p-2 rounded w-full mb-2" onChange={handleChange} />
      <textarea name="description" placeholder="SEO Blog Description" className="border p-2 rounded w-full mb-4" onChange={handleChange} />

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 3: Appearance & Hosting</h1>
      <p className="text-gray-600 mb-4">This is how your website will look and work.</p>

      <select name="template" className="border p-2 rounded w-full mb-4" onChange={handleChange}>
        <option value="">Select Template</option>
        <option value="Magazine">Magazine</option>
        <option value="Portfolio">Portfolio</option>
        <option value="Creator">Creator</option>
      </select>

      <div className="flex items-center mb-4 space-x-2">
        <input type="checkbox" name="monetize" onChange={handleChange} />
        <label>Enable Blog Monetization (earn revenue with ads)</label>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
        <button onClick={() => console.log('Submitted:', form)} className="bg-green-600 text-white px-6 py-2 rounded">Finish & Publish</button>
      </div>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
