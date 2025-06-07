import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Setup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: '',
    title: '',
    description: '',
    category: '',
    niche: '',
    template: '',
    logo: null,
    monetize: false,
    hostingPlan: null,
  });

  const categories = ['Christianity', 'Technology', 'Health', 'Business', 'Education'];
  const niches = {
    Christianity: ['Faith', 'Evangelism', 'Church Growth'],
    Technology: ['AI', 'Web Development', 'Blockchain'],
    Health: ['Fitness', 'Nutrition', 'Mental Health'],
    Business: ['Marketing', 'Startups', 'Finance'],
    Education: ['Study Tips', 'Scholarships', 'E-learning'],
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, logo: URL.createObjectURL(file) });
  };
  const handleMonetizeToggle = () => setForm(prev => ({ ...prev, monetize: !prev.monetize }));
  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleGenerateSEO = () => {
    if (form.title && form.category) {
      const desc = `Welcome to ${form.title}, a trusted destination for ${form.category} insights and content.`;
      setForm(prev => ({ ...prev, description: desc }));
    }
  };

  const previewDomain = () => {
    return form.domainType === 'subdomain'
      ? `${form.subdomain}.cybev.io`
      : 'example.com';
  };

  const steps = [
    <div key="step1" className="space-y-4">
      <h2 className="text-xl font-bold">Step 1: Domain Setup</h2>
      <select name="domainType" value={form.domainType} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="subdomain">Use a free subdomain</option>
        <option value="existing">Use an existing domain</option>
        <option value="register">Register a new domain</option>
      </select>
      <input
        name="subdomain"
        value={form.subdomain}
        onChange={handleChange}
        placeholder="Enter subdomain..."
        className="w-full p-2 border rounded"
      />
    </div>,
    <div key="step2" className="space-y-4">
      <h2 className="text-xl font-bold">Step 2: Blog Identity</h2>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Blog Title" className="w-full p-2 border rounded" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="SEO Description" className="w-full p-2 border rounded" />
      <button onClick={handleGenerateSEO} className="px-3 py-1 bg-blue-600 text-white rounded">AI Generate SEO</button>
      <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Select Category</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        <option value="Other">Other</option>
      </select>
      <select name="niche" value={form.niche} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Select Niche</option>
        {(niches[form.category] || []).map(n => <option key={n} value={n}>{n}</option>)}
        <option value="Other">Other</option>
      </select>
    </div>,
    <div key="step3" className="space-y-4">
      <h2 className="text-xl font-bold">Step 3: Design & Branding</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['minimal', 'magazine', 'portfolio'].map(tpl => (
          <div
            key={tpl}
            className={`p-4 border rounded-xl cursor-pointer ${form.template === tpl ? 'border-blue-600' : 'border-gray-300'}`}
            onClick={() => setForm({ ...form, template: tpl })}
          >
            <div className="h-24 bg-gray-200 rounded mb-2" />
            <p className="text-center capitalize">{tpl}</p>
          </div>
        ))}
      </div>
      <input type="file" accept="image/*" onChange={handleLogoUpload} />
      {form.logo && <img src={form.logo} alt="logo" className="w-24 h-24 object-contain border rounded" />}
      <label className="block">
        <input type="checkbox" checked={form.monetize} onChange={handleMonetizeToggle} className="mr-2" />
        Enable Monetization
      </label>
    </div>,
    <div key="step4" className="space-y-4">
      <h2 className="text-xl font-bold">Step 4: Preview</h2>
      <div className="p-4 border rounded-xl bg-white space-y-2">
        <p><strong>Domain:</strong> {previewDomain()}</p>
        <p><strong>Title:</strong> {form.title}</p>
        <p><strong>Category:</strong> {form.category}</p>
        <p><strong>Niche:</strong> {form.niche}</p>
        <p><strong>Template:</strong> {form.template}</p>
        {form.logo && <img src={form.logo} alt="preview logo" className="w-20 h-20 object-contain" />}
      </div>
    </div>,
    <div key="step5" className="space-y-4">
      <h2 className="text-xl font-bold">Step 5: Hosting</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 text-center">
          <h3 className="font-semibold">Free Hosting</h3>
          <p>Use .cybev.io subdomain</p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Publish Free</button>
        </div>
        <div className="border rounded-xl p-4 text-center">
          <h3 className="font-semibold">Web Hosting</h3>
          <p>$10/mo – 10GB SSD</p>
          <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">Pay with CYBV</button>
        </div>
        <div className="border rounded-xl p-4 text-center">
          <h3 className="font-semibold">VPS Hosting</h3>
          <p>$50/mo – 100GB SSD</p>
          <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded">Pay with Cryptomus</button>
        </div>
      </div>
    </div>
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">CYBEV Blog Setup – Step {step} of 5</h1>
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full"
          >
            {steps[step - 1]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-between flex-col sm:flex-row gap-4">
        {step > 1 && (
          <button onClick={goBack} className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded">Back</button>
        )}
        {step < 5 && (
          <button onClick={goNext} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded">Next</button>
        )}
      </div>
    </div>
  );
}
