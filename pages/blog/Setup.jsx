
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Setup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: '',
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

  const categories = ['Christianity', 'Technology', 'Health', 'Business'];
  const niches = {
    Christianity: ['Faith', 'Evangelism'],
    Technology: ['AI', 'Web Development'],
    Health: ['Fitness', 'Nutrition'],
    Business: ['Startups', 'Marketing']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAI = () => {
    if (form.title && form.category) {
      setForm(prev => ({
        ...prev,
        description: `Welcome to ${form.title}, your trusted source for ${form.category} content.`
      }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, logo: URL.createObjectURL(file) });
  };

  const handleMonetizeToggle = () => {
    setForm(prev => ({ ...prev, monetize: !prev.monetize }));
  };

  useEffect(() => {
    if (form.subdomain.length > 2) {
      const timeout = setTimeout(() => {
        setForm(prev => ({ ...prev, domainAvailable: true }));
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [form.subdomain]);

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  const steps = [
    <div key="step1" className="space-y-4">
      <h2 className="text-xl font-bold">Step 1: Domain Setup</h2>
      <select name="domainType" value={form.domainType} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="subdomain">Free Subdomain</option>
        <option value="existing">Use Existing</option>
        <option value="register">Register New</option>
      </select>
      <input name="subdomain" value={form.subdomain} onChange={handleChange} placeholder="Enter subdomain..." className="w-full p-2 border rounded" />
      {form.domainAvailable && <p className="text-green-600">Subdomain available ✅</p>}
    </div>,

    <div key="step2" className="space-y-4">
      <h2 className="text-xl font-bold">Step 2: Blog Info</h2>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Blog Title" className="w-full p-2 border rounded" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="SEO Description" className="w-full p-2 border rounded" />
      <button onClick={handleAI} className="px-4 py-2 bg-blue-600 text-white rounded">AI Generate SEO</button>
      <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Select Category</option>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>
      <select name="niche" value={form.niche} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Select Niche</option>
        {(niches[form.category] || []).map((n) => <option key={n}>{n}</option>)}
      </select>
    </div>,

    <div key="step3" className="space-y-4">
      <h2 className="text-xl font-bold">Step 3: Design</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['minimal', 'magazine', 'portfolio'].map((tpl) => (
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
      {form.logo && <img src={form.logo} alt="logo" className="w-20 h-20 object-contain border rounded" />}
      <label className="block">
        <input type="checkbox" checked={form.monetize} onChange={handleMonetizeToggle} className="mr-2" />
        Enable Monetization
      </label>
    </div>,

    <div key="step4" className="space-y-4">
      <h2 className="text-xl font-bold">Step 4: Preview</h2>
      <div className="p-4 border rounded-xl bg-white space-y-2">
        <p><strong>Domain:</strong> {form.subdomain}.cybev.io</p>
        <p><strong>Title:</strong> {form.title}</p>
        <p><strong>Category:</strong> {form.category}</p>
        <p><strong>Niche:</strong> {form.niche}</p>
        <p><strong>Template:</strong> {form.template}</p>
        {form.logo && <img src={form.logo} alt="preview logo" className="w-16 h-16 object-contain" />}
      </div>
    </div>,

    <div key="step5" className="space-y-4">
      <h2 className="text-xl font-bold">Step 5: Hosting</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { id: 'free', title: 'Free Hosting', price: 'Free', btn: 'Publish Now', color: 'blue' },
          { id: 'web', title: 'Web Hosting', price: '$10/mo', btn: 'Pay with CYBV', color: 'green' },
          { id: 'vps', title: 'VPS Hosting', price: '$50/mo', btn: 'Pay with Cryptomus', color: 'purple' }
        ].map(plan => (
          <div key={plan.id} className="p-4 border rounded-xl text-center shadow">
            <h3 className="font-semibold">{plan.title}</h3>
            <p>{plan.price}</p>
            <button className={`mt-2 px-4 py-2 bg-${plan.color}-600 text-white rounded`}>{plan.btn}</button>
          </div>
        ))}
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
        {step > 1 && <button onClick={goBack} className="px-4 py-2 bg-gray-300 rounded w-full sm:w-auto">Back</button>}
        {step < 5 && <button onClick={goNext} className="px-4 py-2 bg-blue-600 text-white rounded w-full sm:w-auto">Next</button>}
      </div>
    </div>
  );
}
