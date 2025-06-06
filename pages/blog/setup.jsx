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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">Setup Blog</h2>
      <div className="mt-4">
        {renderTemplates()}
      </div>
    </div>
  );
}
