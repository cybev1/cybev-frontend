
import { useEffect, useState } from 'react';

const categoryNiches = {
  Christianity: ['Faith', 'Leadership', 'Prayer', 'Evangelism', 'Bible Study', 'Church Growth', 'Christian Living', 'Healing', 'End Times', 'Love', 'Grace', 'Purpose', 'Fellowship', 'Ministry', 'Youth Ministry', 'Worship', 'Miracles', 'Salvation', 'Others'],
  Business: ['Startups', 'Marketing', 'Finance', 'Entrepreneurship', 'Investing', 'E-commerce', 'Branding', 'Sales', 'Leadership', 'Economics', 'HR', 'Strategy', 'Negotiation', 'Growth Hacking', 'Innovation', 'Analytics', 'Budgeting', 'Tax', 'Others'],
  Technology: ['Web Development', 'AI', 'Cloud', 'Cybersecurity', 'DevOps', 'Data Science', 'Mobile Apps', 'Blockchain', 'IoT', 'AR/VR', 'Machine Learning', 'Programming', 'SaaS', 'Startups', 'UX/UI', 'Automation', 'Open Source', 'APIs', 'Others'],
};

const categoryTemplates = {
  Christianity: 'Magazine',
  Business: 'Creator',
  Technology: 'Portfolio',
};

const templates = ['Magazine', 'Creator', 'Portfolio', 'Minimalist', 'Custom'];

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
    monetize: false,
    hostingPlan: null,
  });

  const [hostingPlans, setHostingPlans] = useState([]);
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

  const generateSEODescription = () => {
    const keyword = form.title || "your blog";
    const seoText = `Read inspiring content and discover valuable insights from ${keyword}. Join ${keyword}.cybev.io today!`;
    setForm(prev => ({ ...prev, description: seoText }));
  };

  const handleSubmit = () => {
    const fullSubdomain = form.subdomain ? `${form.subdomain}.cybev.io` : '';
    const blogData = {
      ...form,
      subdomain: fullSubdomain,
      finalDomain: form.domainType === 'subdomain'
        ? fullSubdomain
        : form.domainType === 'existing'
        ? form.existingDomain
        : form.newDomain,
      freeHosting: form.domainType === 'subdomain',
    };

    console.log('Blog Setup Submitted:', blogData);
    alert("Blog setup submitted! Check console log for full data.");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <label className="font-medium">Domain Type</label>
        <select name="domainType" onChange={handleChange} className="border p-2 rounded w-full">
          <option value="subdomain">Use Free Subdomain</option>
          <option value="existing">Use Existing Domain</option>
          <option value="register">Register New Domain</option>
        </select>
      </div>

<input name="title" placeholder="Blog Title" className="border p-2 rounded w-full mt-2" onChange={handleChange} />

      <div className="space-y-2">
        <label className="font-medium">Domain Type</label>
        <select name="domainType" onChange={handleChange} className="border p-2 rounded w-full">
          <option value="subdomain">Use Free Subdomain</option>
          <option value="existing">Use Existing Domain</option>
          <option value="register">Register New Domain</option>
        </select>

        {form.domainType === 'subdomain' && (
          <>
            
            {form.subdomain && <p className="text-sm text-gray-600 mt-1">Full Blog URL: <strong>{form.subdomain}.cybev.io</strong></p>}
          </>
        )}

        {form.domainType === 'existing' && (
          <input name="existingDomain" placeholder="yourdomain.com" className="border p-2 rounded w-full" onChange={handleChange} />
        )}

        {form.domainType === 'register' && (
          <input name="newDomain" placeholder="searchdomain.com" className="border p-2 rounded w-full" onChange={handleChange} />
        )}
      </div>


      
      <textarea name="description" placeholder="SEO Blog Description (auto-generated or editable)" className="border p-2 rounded w-full" value={form.description} onChange={handleChange} />
      <button onClick={generateSEODescription} className="bg-indigo-600 text-white px-4 py-2 rounded">AI Generate SEO Description</button>

      

      {form.domainType === 'subdomain' && (
        <>
          
          {form.subdomain && <p className="text-sm text-gray-600 mt-1">Full Blog URL: <strong>{form.subdomain}.cybev.io</strong></p>}
        </>
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

      <div className="space-y-2">
        <label className="font-medium">Choose Template</label>
        <select name="template" value={form.template} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Select Template</option>
          {templates.map((tpl, idx) => (
            <option key={idx} value={tpl}>{tpl}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" name="monetize" onChange={handleChange} />
        <label className="text-sm">Enable Blog Monetization</label>
      </div>

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
