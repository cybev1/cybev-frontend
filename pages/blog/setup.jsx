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
    otherNiche: '',
    template: '',
    logo: null,
    logoPreview: '',
    monetize: false
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const categories = {
    Christianity: ['Faith', 'Bible Study', 'Devotionals', 'Leadership', 'Sermons'],
    Technology: ['AI', 'Web Development', 'Cybersecurity', 'Blockchain', 'Gadgets'],
    Health: ['Nutrition', 'Fitness', 'Mental Health', 'Diseases', 'Wellness'],
  };

  const templates = {
    Christianity: ['faithful.png', 'grace.png', 'light.png'],
    Technology: ['codecraft.png', 'neon-ui.png', 'aitech.png'],
    Health: ['fitlife.png', 'wellnessplus.png', 'greenherb.png']
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const checkDomainAvailability = (domain) => {
    if (!domain) {
      setForm(prev => ({ ...prev, domainAvailable: null }));
      setAvailabilityMsg('');
      return;
    }

    setAvailabilityMsg('Checking availability...');
    setTimeout(() => {
      const isAvailable = !domain.includes("taken");
      setForm(prev => ({ ...prev, domainAvailable: isAvailable }));
      setAvailabilityMsg(isAvailable
        ? `Congratulations! ${domain} is available.`
        : `${domain} is already taken. Please try another.`);
    }, 800);
  };

  const handleDomainInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (typingTimeout) clearTimeout(typingTimeout);
    const domain = form.domainType === 'subdomain' ? `${value}.cybev.io` : value;
    setTypingTimeout(setTimeout(() => checkDomainAvailability(domain), 500));
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

  const generateSEO = () => {
    const seo = `Discover insights and updates on ${form.title || 'this blog'} – covering topics in ${form.niche || form.category}.`;
    setForm(prev => ({ ...prev, description: seo }));
  };

  const handleTemplateSelect = (template) => {
    setForm(prev => ({ ...prev, template }));
  };

  const renderNicheOptions = () => {
    if (!form.category) return null;
    const niches = categories[form.category] || [];
    return (
      <>
        <label className="block font-medium">Niche</label>
        <select
          name="niche"
          value={form.niche}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select a niche</option>
          {niches.map((n, idx) => (
            <option key={idx} value={n}>{n}</option>
          ))}
          <option value="Other">Other (specify below)</option>
        </select>
        {form.niche === 'Other' && (
          <input
            type="text"
            name="otherNiche"
            placeholder="Enter your niche"
            value={form.otherNiche}
            onChange={handleChange}
            className="mt-2 border px-3 py-2 rounded w-full"
          />
        )}
      </>
    );
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
            <img src={`/templates/${tpl}`} alt={tpl} className="w-full h-36 object-contain rounded mb-2 bg-white" />
            <p className="text-center text-sm">{tpl.replace('.png', '').replace(/-/g, ' ')}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-1">Step 1: Domain Setup</h2>
          <p className="text-sm text-gray-600">This is how people will find you online</p>

          <label className="block font-medium">Domain Type</label>
          <select
            name="domainType"
            value={form.domainType}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="subdomain">Use a Free Subdomain</option>
            <option value="existing">Use My Existing Domain</option>
            <option value="register">Register a New Domain</option>
          </select>

          <label className="block font-medium mt-4">
            {form.domainType === 'subdomain' ? 'Choose Subdomain' :
              form.domainType === 'existing' ? 'Enter Your Existing Domain' : 'Search for New Domain'}
          </label>
          <input
            type="text"
            name={form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain'}
            value={form.domainType === 'subdomain' ? form.subdomain : form.domainType === 'existing' ? form.existingDomain : form.newDomain}
            onChange={handleDomainInput}
            placeholder={form.domainType === 'subdomain' ? 'e.g. myblog' : 'e.g. example.com'}
            className="border px-3 py-2 rounded w-full"
          />

          {availabilityMsg && (
            <p className={`text-sm ${form.domainAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {availabilityMsg}
            </p>
          )}
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-1">Step 2: Blog Identity</h2>
          <p className="text-sm text-gray-600">This is your business or brand name and what people will call your blog</p>

          <label className="block font-medium">Blog Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Living Faith Daily"
            className="border px-3 py-2 rounded w-full"
          />

          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Select a category</option>
            {Object.keys(categories).map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          {renderNicheOptions()}

          <label className="block font-medium">SEO Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Enter SEO-friendly description"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={generateSEO}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Generate SEO
          </button>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="bg-white/70 backdrop-blur-md shadow-md border border-gray-200 rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-1">Step 3: Design & Branding</h2>
          <p className="text-sm text-gray-600">This is how your website/blog will look like</p>

          <label className="block font-medium mb-2">Choose a Template</label>
          {renderTemplates()}

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

          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              name="monetize"
              checked={form.monetize}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-sm font-medium">Monetize Your Blog</label>
          </div>
        </div>
      );
    }

    return <div className="text-lg font-medium">Step {step} content will go here...</div>;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
        {step < 6 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
