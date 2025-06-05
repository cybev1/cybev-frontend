
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

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDomainInput = (e) => {
    const value = e.target.value;
    const domainKey = form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain';

    setForm(prev => ({
      ...prev,
      [domainKey]: value
    }));

    setAvailabilityMsg('');
    if (typingTimeout) clearTimeout(typingTimeout);

    const fullDomain = form.domainType === 'subdomain' ? `${value}.cybev.io` : value;

    setTypingTimeout(setTimeout(() => {
      fetch(`/api/hosting/domain-check?domain=${fullDomain}`)
        .then(res => res.json())
        .then(data => setAvailabilityMsg(data.message))
        .catch(() => setAvailabilityMsg("❌ Could not check domain."));
    }, 600));
  };

  const renderStep1 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 1: Choose Your Domain</h1>
      <p className="text-gray-600 mb-4">This is how people will find you online.</p>

      <select name="domainType" onChange={handleChange} className="border p-2 rounded w-full mb-4" value={form.domainType}>
        <option value="subdomain">Use Free Subdomain</option>
        <option value="existing">Use Existing Domain</option>
        <option value="register">Register New Domain</option>
      </select>

      <input
        type="text"
        placeholder={form.domainType === 'subdomain' ? "Enter subdomain (e.g., myblog)" : "Enter your domain"}
        className="border p-2 rounded w-full"
        value={
          form.domainType === 'subdomain' ? form.subdomain :
          form.domainType === 'existing' ? form.existingDomain : form.newDomain
        }
        onChange={handleDomainInput}
      />

      {availabilityMsg && (
        <p className={`mt-2 text-sm ${availabilityMsg.includes('🎉') ? 'text-green-600' : 'text-red-600'}`}>
          {availabilityMsg}
        </p>
      )}

      <div className="flex justify-between mt-6">
        <span></span>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );

  
  const categoryNiches = {
    Christianity: ['Faith', 'Leadership', 'Prayer', 'Evangelism', 'Bible Study', 'Church Growth', 'Christian Living', 'Healing', 'End Times', 'Love', 'Grace', 'Purpose', 'Fellowship', 'Ministry', 'Youth Ministry', 'Worship', 'Miracles', 'Salvation', 'Others'],
    Business: ['Startups', 'Marketing', 'Finance', 'Entrepreneurship', 'Investing', 'E-commerce', 'Branding', 'Sales', 'Leadership', 'Economics', 'HR', 'Strategy', 'Negotiation', 'Growth Hacking', 'Innovation', 'Analytics', 'Budgeting', 'Tax', 'Others'],
    Technology: ['Web Development', 'AI', 'Cloud', 'Cybersecurity', 'DevOps', 'Data Science', 'Mobile Apps', 'Blockchain', 'IoT', 'AR/VR', 'Machine Learning', 'Programming', 'SaaS', 'Startups', 'UX/UI', 'Automation', 'Open Source', 'APIs', 'Others'],
  };

  const [niches, setNiches] = useState([]);

  useEffect(() => {
    if (form.category) {
      setNiches(categoryNiches[form.category] || []);
    }
  }, [form.category]);

  const generateDescription = () => {
    const text = form.title
      ? `Welcome to ${form.title}, your destination for engaging content and timeless insights.`
      : 'Welcome to your new blog. Discover insightful content and share your voice with the world.';
    setForm(prev => ({ ...prev, description: text }));
  };

  const renderStep2 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 2: Blog Identity</h1>
      <p className="text-gray-600 mb-4">This is your blog's name and what it will be known for.</p>

      <input
        name="title"
        placeholder="Blog Title"
        value={form.title}
        className="border p-2 rounded w-full mb-3"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="SEO Blog Description"
        value={form.description}
        className="border p-2 rounded w-full mb-2"
        onChange={handleChange}
      />

      <button onClick={generateDescription} className="bg-indigo-600 text-white px-4 py-2 rounded mb-4">
        AI Generate Description
      </button>

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-3"
      >
        <option value="">Select Category</option>
        {Object.keys(categoryNiches).map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        name="niche"
        value={form.niche}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Select Niche</option>
        {niches.map((niche, i) => (
          <option key={i} value={niche}>{niche}</option>
        ))}
        <option value="Others">Others</option>
      </select>

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );


  // NOTE: Replaced Step 2 logic above

  const placeholderRenderStep2 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 2: Blog Identity</h1>
      <p className="text-gray-600 mb-4">This is your blog's name and details.</p>

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
      <p className="text-gray-600 mb-4">This is how your blog will look and feel.</p>

      <label className="block mb-2 font-medium">Choose Template</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {['Magazine', 'Portfolio', 'Creator'].map((tpl, idx) => (
          <div
            key={idx}
            onClick={() => setForm(prev => ({ ...prev, template: tpl }))}
            className={`border rounded p-3 cursor-pointer hover:border-blue-500 ${form.template === tpl ? 'border-blue-600' : ''}`}
          >
            <img src={`/templates/\${tpl.toLowerCase()}.jpg`} alt={tpl} className="w-full h-32 object-cover rounded mb-2" />
            <p className="text-center font-semibold">{tpl}</p>
          </div>
        ))}
      </div>

      <label className="block mb-2 font-medium">Upload Logo (optional)</label>
      <input type="file" accept="image/*" onChange={(e) => setForm(prev => ({ ...prev, logo: e.target.files[0] }))} className="mb-4" />

      <div className="flex items-center mb-4 space-x-2">
        <input type="checkbox" name="monetize" checked={form.monetize} onChange={handleChange} />
        <label>Enable Blog Monetization (earn revenue with ads)</label>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
        <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
      </div>
    </>
  );


  // NOTE: Step 3 updated with previews and logo upload

  const placeholderRenderStep3 = () => (
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
