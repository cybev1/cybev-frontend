
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

  const renderStep1 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 1: Domain Setup</h1>
      <select name="domainType" onChange={handleChange} value={form.domainType} className="border p-2 rounded w-full mb-4">
        <option value="subdomain">Use Free Subdomain</option>
        <option value="existing">Use Existing Domain</option>
        <option value="register">Register New Domain</option>
      </select>
      <input
        type="text"
        placeholder="Enter domain"
        className="border p-2 rounded w-full"
        value={form.domainType === 'subdomain' ? form.subdomain : form.domainType === 'existing' ? form.existingDomain : form.newDomain}
        onChange={(e) => {
          const key = form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain';
          setForm(prev => ({ ...prev, [key]: e.target.value }));
        }}
      />
      <div className="flex justify-between mt-6">
        <span></span>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 2: Blog Identity</h1>
      <input name="title" placeholder="Blog Title" value={form.title} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="SEO Blog Description" className="border p-2 rounded w-full mb-2" />
      <button onClick={() => {
        const text = form.title ? `Welcome to ${form.title}` : 'Welcome to your new blog.';
        setForm(prev => ({ ...prev, description: text }));
      }} className="bg-indigo-600 text-white px-4 py-2 rounded mb-4">AI Generate Description</button>
      <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded w-full mb-3">
        <option value="">Select Category</option>
        {Object.keys(categoryNiches).map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
      </select>
      <select name="niche" value={form.niche} onChange={handleChange} className="border p-2 rounded w-full">
        <option value="">Select Niche</option>
        {niches.map((niche, i) => <option key={i} value={niche}>{niche}</option>)}
        <option value="Others">Others</option>
      </select>
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 3: Appearance</h1>
      <select name="template" value={form.template} onChange={handleChange} className="border p-2 rounded w-full mb-4">
        <option value="">Select Template</option>
        <option value="Magazine">Magazine</option>
        <option value="Portfolio">Portfolio</option>
      </select>
      <input type="file" accept="image/*" onChange={(e) => setForm(prev => ({ ...prev, logo: e.target.files[0] }))} />
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  const renderStep4 = () => {
    const domain = form.domainType === 'subdomain' ? `${form.subdomain}.cybev.io` : form.domainType === 'existing' ? form.existingDomain : form.newDomain;
    return (
      <>
        <h1 className="text-2xl font-bold mb-4">Step 4: Preview</h1>
        <div className="space-y-2">
          <div><strong>Domain:</strong> {domain}</div>
          <div><strong>Title:</strong> {form.title}</div>
          <div><strong>Description:</strong> {form.description}</div>
          <div><strong>Category:</strong> {form.category}</div>
          <div><strong>Niche:</strong> {form.niche}</div>
          <div><strong>Template:</strong> {form.template}</div>
          {form.logo && <img src={URL.createObjectURL(form.logo)} alt="Logo" className="w-24 h-24" />}
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
          <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
        </div>
      </>
    );
  };

  const renderStep5 = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Step 5: Hosting & Publish</h1>
        {form.domainType !== 'subdomain' && (
          <select
            name="hostingPlan"
            value={form.hostingPlan || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, hostingPlan: e.target.value }))}
            className="border p-2 rounded w-full mb-4"
          >
            <option value="">Select Hosting Plan</option>
            <option value="Basic">Basic Plan</option>
            <option value="Pro">Pro Plan</option>
          </select>
        )}
        {form.domainType === 'subdomain' && (
          <p className="text-blue-700 font-semibold mb-4 cursor-pointer underline" onClick={() => {
            console.log('Final Blog Setup:', form);
            alert('🎉 Blog published using free hosting!');
          }}>👉 Skip and publish with free hosting</p>
        )}
        <div className="flex justify-between mt-6">
          <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
          {form.domainType !== 'subdomain' && (
            <button onClick={() => {
              console.log('Final Blog Setup:', form);
              alert('🎉 Blog published!');
            }} className="bg-green-600 text-white px-6 py-2 rounded">Publish</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </div>
  );
}
