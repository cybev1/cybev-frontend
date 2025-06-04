
import { useEffect, useState } from 'react';

export default function BlogSetup() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    subdomain: '',
    customDomain: '',
    category: '',
    niche: '',
    template: '',
    hostingPlan: null,
  });

  const [hostingPlans, setHostingPlans] = useState([]);

  const categories = ['Christianity', 'Church', 'Religion', 'Health', 'Business', 'Education', 'Technology', 'Finance', 'Entertainment', 'Politics'];
  const templates = ['Creator', 'Magazine', 'Portfolio', 'Minimalist', 'Custom'];

  useEffect(() => {
    async function fetchHostingPlans() {
      const res = await fetch('/api/hosting/mock-plans');
      const data = await res.json();
      setHostingPlans(data);
    }
    fetchHostingPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectHosting = (plan) => {
    setForm(prev => ({ ...prev, hostingPlan: plan }));
  };

  const handleSubmit = () => {
    console.log('Blog Setup Data:', form);
    alert("Blog setup submitted. Check console log for details.");
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

      <div className="grid md:grid-cols-2 gap-4">
        <input name="subdomain" placeholder="Subdomain (e.g., myblog)" className="border p-2 rounded" onChange={handleChange} />
        <input name="customDomain" placeholder="Custom Domain (optional)" className="border p-2 rounded" onChange={handleChange} />
      </div>

      <select name="category" className="border p-2 rounded w-full" onChange={handleChange}>
        <option value="">Select Category</option>
        {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
        <option value="Others">Others</option>
      </select>

      <input name="niche" placeholder="Enter niche (e.g., Faith, SEO, AI...)" className="border p-2 rounded w-full" onChange={handleChange} />

      <select name="template" className="border p-2 rounded w-full" onChange={handleChange}>
        <option value="">Select Blog Template</option>
        {templates.map((tpl, idx) => <option key={idx} value={tpl}>{tpl}</option>)}
      </select>

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
