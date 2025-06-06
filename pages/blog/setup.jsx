import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: '',
    existingDomain: '',
    newDomain: '',
    title: '',
    description: '',
    category: '',
    niche: '',
    otherNiche: '',
    template: 'simple.png',
    logoPreview: '/logo-preview.png',
    monetize: true
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const categories = {
    Christianity: ['Faith', 'Bible Study', 'Devotionals', 'Leadership', 'Sermons'],
    Technology: ['AI', 'Web Development', 'Cybersecurity', 'Blockchain', 'Gadgets'],
    Health: ['Nutrition', 'Fitness', 'Mental Health', 'Diseases', 'Wellness']
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDomainInput = (e) => {
    const { name, value } = e.target;
    handleChange(e);
    if (typingTimeout) clearTimeout(typingTimeout);
    const domain = form.domainType === 'subdomain' ? `${value}.cybev.io` : value;
    const timeout = setTimeout(() => {
      const isTaken = value.toLowerCase().includes("taken");
      setAvailabilityMsg(
        value
          ? isTaken
            ? `❌ ${domain} is already taken.`
            : `✅ Congratulations! ${domain} is available.`
          : ''
      );
    }, 600);
    setTypingTimeout(timeout);
  };

  const generateSEO = () => {
    const description = `Discover insights and updates on ${form.title || 'your blog'} covering topics in ${form.niche || form.category}.`;
    setForm((prev) => ({
      ...prev,
      description
    }));
  };

  const renderNicheOptions = () => {
    const list = categories[form.category] || [];
    return (
      <>
        <select
          name="niche"
          className="w-full border px-3 py-2 rounded"
          value={form.niche}
          onChange={handleChange}
        >
          <option value="">Select Niche</option>
          {list.map((niche, idx) => (
            <option key={idx} value={niche}>{niche}</option>
          ))}
          <option value="Other">Other</option>
        </select>
        {form.niche === 'Other' && (
          <input
            type="text"
            name="otherNiche"
            value={form.otherNiche}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-2"
            placeholder="Enter your niche"
          />
        )}
      </>
    );
  };

  const domain =
    form.domainType === 'subdomain' ? `${form.subdomain}.cybev.io` :
    form.domainType === 'existing' ? form.existingDomain : form.newDomain;

  const renderStep = () => {
    if (step === 2) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 2: Blog Identity</h2>
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <select name="category" className="w-full border px-3 py-2 rounded" value={form.category} onChange={handleChange}>
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          {renderNicheOptions()}
          <textarea
            name="description"
            rows={3}
            placeholder="SEO Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={generateSEO}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Generate SEO
          </button>
        </div>
      );
    }

    return <p className="text-sm text-gray-500">This is Step {step}</p>;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {renderStep()}
      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
        {step < 5 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
