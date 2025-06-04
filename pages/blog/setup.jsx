
import { useEffect, useState } from 'react';

const categoryNiches = {
  Christianity: ['Faith', 'Leadership', 'Prayer', 'Evangelism', 'Bible Study', 'Church Growth', 'Christian Living', 'Healing', 'End Times', 'Love', 'Grace', 'Purpose', 'Fellowship', 'Ministry', 'Youth Ministry', 'Worship', 'Miracles', 'Salvation', 'Testimonies', 'Others'],
  Business: ['Startups', 'Marketing', 'Finance', 'Entrepreneurship', 'Investing', 'E-commerce', 'Branding', 'Sales', 'Leadership', 'Economics', 'HR', 'Strategy', 'Negotiation', 'Growth Hacking', 'Innovation', 'Analytics', 'Budgeting', 'Tax', 'Management', 'Others'],
  Technology: ['Web Development', 'AI', 'Cloud', 'Cybersecurity', 'DevOps', 'Data Science', 'Mobile Apps', 'Blockchain', 'IoT', 'AR/VR', 'Machine Learning', 'Programming', 'SaaS', 'Startups', 'UX/UI', 'Automation', 'Open Source', 'APIs', 'Networking', 'Others'],
  // Add more categories and niches if needed
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
  });

  const [availableSubdomains, setAvailableSubdomains] = useState([
    'faith.cybev.io',
    'shop.cybev.io',
    'news.cybev.io',
    'tech.cybev.io',
    'church.cybev.io',
  ]);
  const [niches, setNiches] = useState([]);

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

  const handleSubmit = () => {
    console.log('Blog Setup:', form);
    alert('Blog setup submitted! Check console log.');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Complete Blog Setup</h1>

      <input name="title" placeholder="Blog Title" className="border p-2 rounded w-full" onChange={handleChange} />
      <textarea name="description" placeholder="Blog Description" className="border p-2 rounded w-full" onChange={handleChange} />

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

      <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">Submit Blog Setup</button>
    </div>
  );
}
