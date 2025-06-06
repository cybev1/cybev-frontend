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
            className={\`border rounded-xl p-3 shadow hover:ring-2 cursor-pointer \${form.template === tpl ? 'ring-2 ring-blue-600' : ''}\`}
            onClick={() => handleTemplateSelect(tpl)}
          >
            <img src={\`/templates/\${tpl}\`} alt={tpl} className="w-full h-36 object-contain rounded mb-2 bg-white" />
            <p className="text-center text-sm">{tpl.replace('.png', '').replace(/-/g, ' ')}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    if (step === 4) {
      const domain =
        form.domainType === 'subdomain' ? `${form.subdomain}.cybev.io` :
        form.domainType === 'existing' ? form.existingDomain :
        form.newDomain;

      return (
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Step 4: Blog Preview</h2>
          <p className="text-gray-600 text-sm mb-4">Here’s a visual summary of your blog setup.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 border rounded-xl">
              <h4 className="text-sm font-medium text-gray-500">Blog Domain</h4>
              <p className="text-blue-700 font-semibold mt-1">{domain}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <h4 className="text-sm font-medium text-gray-500">Blog Title</h4>
              <p className="text-gray-800 font-semibold mt-1">{form.title}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <h4 className="text-sm font-medium text-gray-500">Category & Niche</h4>
              <p className="text-gray-800 mt-1">{form.category} – {form.niche === 'Other' ? form.otherNiche : form.niche}</p>
            </div>

            <div className="p-4 border rounded-xl sm:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">SEO Description</h4>
              <p className="text-gray-700 mt-1">{form.description}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <h4 className="text-sm font-medium text-gray-500">Selected Template</h4>
              {form.template ? (
                <img src={`/templates/${form.template}`} alt="Template" className="mt-2 w-full h-32 object-contain border rounded" />
              ) : <p className="text-gray-400">No template selected</p>}
            </div>

            <div className="p-4 border rounded-xl">
              <h4 className="text-sm font-medium text-gray-500">Logo Preview</h4>
              {form.logoPreview ? (
                <img src={form.logoPreview} alt="Logo" className="mt-2 h-16 w-auto rounded bg-white shadow" />
              ) : <p className="text-gray-400">No logo uploaded</p>}
            </div>

            <div className="p-4 border rounded-xl">
              <h4 className="text-sm font-medium text-gray-500">Monetization</h4>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                form.monetize ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
              }`}>
                {form.monetize ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return <div className="text-gray-500 italic">Step {step} content rendered from 1–3 here...</div>;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {renderStep()}
      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
        {step < 6 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
