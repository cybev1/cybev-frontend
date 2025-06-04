
import { useEffect, useState } from 'react';

const categoryNiches = {
  Christianity: ['Faith', 'Leadership', 'Prayer', 'Evangelism', 'Bible Study', 'Church Growth', 'Christian Living', 'Healing', 'End Times', 'Love', 'Grace', 'Purpose', 'Fellowship', 'Ministry', 'Youth Ministry', 'Worship', 'Miracles', 'Salvation', 'Others'],
  Business: ['Startups', 'Marketing', 'Finance', 'Entrepreneurship', 'Investing', 'E-commerce', 'Branding', 'Sales', 'Leadership', 'Economics', 'HR', 'Strategy', 'Negotiation', 'Growth Hacking', 'Innovation', 'Analytics', 'Budgeting', 'Tax', 'Others'],
  Technology: ['Web Development', 'AI', 'Cloud', 'Cybersecurity', 'DevOps', 'Data Science', 'Mobile Apps', 'Blockchain', 'IoT', 'AR/VR', 'Machine Learning', 'Programming', 'SaaS', 'Startups', 'UX/UI', 'Automation', 'Open Source', 'APIs', 'Networking', 'Others'],
};

const categoryTemplates = {
  Christianity: 'Magazine',
  Business: 'Creator',
  Technology: 'Portfolio',
};

export default function BlogSetup() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    subdomain: '',
    domainType: 'subdomain',
    existingDomain: '',
    newDomain: '',
    category: '',
    niche: '',
    template: '',
    seo: '',
    monetize: false,
    hostingPlan: null,
  });

  const [hostingPlans, setHostingPlans] = useState([]);
  const [availableSubdomains] = useState([
    'faith.cybev.io',
    'shop.cybev.io',
    'news.cybev.io',
    'tech.cybev.io',
    'church.cybev.io',
  ]);
  const [niches, setNiches] = useState([]);

  useEffect(() => {
    async function fetchHostingPlans() {
      const res = await fetch('/api/hosting/mock-plans');
      const data = await res.json();
      setHostingPlans(data);
    }
    fetchHostingPlans();
  }, []);

  useEffect(() => {
    if (form.category) {
      setNiches(categoryNiches[form.category] || []);
      setForm(prev => ({ ...prev, template: categoryTemplates[form.category] || '' }));
    }
  }, [form.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectHosting = (plan) => {
    setForm(prev => ({ ...prev, hostingPlan: plan }));
  };

  const handleSubmit = () => {
    const blogData = {
      ...form,
      finalDomain: form.domainType === 'subdomain'
        ? form.subdomain
        : form.domainType === 'existing'
        ? form.existingDomain
        : form.newDomain,
      freeHosting: form.domainType === 'subdomain',
    };

    console.log('Blog Setup Submitted:', blogData);
    alert("Blog setup submitted. Check console log for full data.");
  };

  const generateDescription = () => {
    setForm(prev => ({
      ...prev,
      description: 'Empower your vision with this inspiring blog. Start sharing today!'
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Complete Blog Setup</h1>

      <input name="title" placeholder="Blog Title" className="border p-2 rounded w-full" onChange={handleChange} />
      <textarea name="description" placeholder="Blog Description" className="border p-2 rounded w-full" value={form.description} onChange={handleChange} />
      <button onClick={generateDescription} className="bg-blue-600 text-white px-4 py-2 rounded">AI Generate Description</button>

      <div className="space-y-2">
        <label className="font-medium">Domain Type</label>
        <select name="domainType" onChange={handleChange} className="border p-2 rounded w-full">
          <option value="subdomain">Use Free Subdomain</option>
          <option value="existing">Use Existing Domain</option>
          <option value="register">Register New Domain</option>
        </select>
      </div>

      {form.domainType === 'subdomain' && (
        <select name="subdomain" onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Select Subdomain</option>
          {availableSubdomains.map((sd, idx) => (
            <option key={idx} value={sd}>{sd}</option>
          ))}
        </select>
      )}

      {form.domainType === 'existing' && (
        <input name="existingDomain" placeholder="yourdomain.com" className="border p-2 rounded w-full" onChange={handleChange} />
      )}

      {form.domainType === 'register' && (
        <input name="newDomain" placeholder="searchdomain.com" className="border p-2 rounded w-full" onChange={handleChange} />
      )}

      <select name="category" onChange={handleChange} className="border p-2 rounded w-full">
        <option value="">Select Category</option>
        {Object.keys(categoryNiches).map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
        ))}
      </select>

      <select name="niche" onChange={handleChange} className="border p-2 rounded w-full">
        <option value="">Select Niche</option>
        {niches.map((niche, i) => (
          <option key={i} value={niche}>{niche}</option>
        ))}
        <option value="Others">Others</option>
      </select>

      <input name="seo" placeholder="SEO Description (optional)" className="border p-2 rounded w-full" onChange={handleChange} />

      <div className="flex items-center space-x-2">
        <input type="checkbox" name="monetize" onChange={handleChange} />
        <label className="text-sm">Enable Blog Monetization</label>
      </div>

      <input name="template" value={form.template} readOnly className="border p-2 rounded w-full bg-gray-100" placeholder="Template (auto-suggested)" />

      <h2 className="text-2xl font-semibold mt-6">Select Hosting Plan</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {hostingPlans.map((plan, i) => (
          <div
            key={i}
            onClick={() => handleSelectHosting(plan)}
            className={`cursor-pointer border p-4 rounded shadow hover:border-blue-500 ${
              form.hostingPlan?.name === plan.name ? 'border-blue-600' : ''
            }`}
          >
            <h3 className="text-xl font-bold text-blue-700">{plan.name}</h3>
            <p className="text-sm text-gray-600">{plan.description}</p>
            <p className="text-green-600 font-bold">{plan.price}</p>
            <ul className="text-xs mt-2 text-gray-700 list-disc list-inside">
              {plan.features.map((f, idx) => <li key={idx}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded">Submit Blog Setup</button>
    </div>
  );
}
