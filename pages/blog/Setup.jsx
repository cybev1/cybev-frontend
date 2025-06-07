import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Setup() {
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
    monetize: false
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  const checkDomainAvailability = (domain) => {
    if (domain.length > 3) {
      setForm(prev => ({ ...prev, domainAvailable: true }));
      setAvailabilityMsg('🎉 Congratulations! The domain is available');
    } else {
      setForm(prev => ({ ...prev, domainAvailable: false }));
      setAvailabilityMsg('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (['subdomain', 'existingDomain', 'newDomain'].includes(name)) {
      clearTimeout(typingTimeout);
      const timeout = setTimeout(() => checkDomainAvailability(value), 1000);
      setTypingTimeout(timeout);
    }
  };

  const handleDomainTypeChange = (e) => {
    const { value } = e.target;
    setForm(prev => ({ ...prev, domainType: value, domainAvailable: null }));
    setAvailabilityMsg('');
  };

  const nextStep = () => setStep(step + 1);
  const goBack = () => setStep(step - 1);

  const handleAIGenerate = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setForm(prev => ({ ...prev, description: 'Welcome to a blog that inspires and informs. Discover amazing content crafted for your success.' }));
      setAiGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white text-black p-6 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200 space-y-6">

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold mb-2 text-center">Step 1 – Domain Setup</h2>
            <select name="domainType" value={form.domainType} onChange={handleDomainTypeChange} className="w-full p-3 border rounded-lg mb-4">
              <option value="subdomain">Use a free subdomain (.cybev.io)</option>
              <option value="existingDomain">Use an existing domain</option>
              <option value="newDomain">Register a new domain</option>
            </select>
            <input
              type="text"
              name={form.domainType}
              value={form[form.domainType]}
              onChange={handleInputChange}
              placeholder="Enter your domain"
              className="w-full p-3 border rounded-lg"
            />
            {availabilityMsg && <p className="text-green-600 mt-2">{availabilityMsg}</p>}
            <div className="flex justify-end mt-6">
              <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Continue</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold mb-2 text-center">Step 2 – Blog Identity</h2>
            <input type="text" name="title" placeholder="Blog Title" value={form.title} onChange={handleInputChange} className="w-full p-3 border rounded-lg mb-4" />
            <textarea name="description" placeholder="SEO Description" value={form.description} onChange={handleInputChange} className="w-full p-3 border rounded-lg mb-2" />
            <button onClick={handleAIGenerate} className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded">{aiGenerating ? 'Generating...' : 'AI Generate SEO'}</button>
            <select name="category" value={form.category} onChange={handleInputChange} className="w-full p-3 border rounded-lg mb-4">
              <option value="">Select Category</option>
              <option value="Christianity">Christianity</option>
              <option value="Tech">Tech</option>
              <option value="Health">Health</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
            <select name="niche" value={form.niche} onChange={handleInputChange} className="w-full p-3 border rounded-lg">
              <option value="">Select Niche</option>
              {form.category === "Christianity" && <>
                <option value="Faith & Healing">Faith & Healing</option>
                <option value="Daily Devotionals">Daily Devotionals</option>
                <option value="Christian Living">Christian Living</option>
              </>}
              {form.category === "Tech" && <>
                <option value="AI Tools">AI Tools</option>
                <option value="Web Development">Web Development</option>
                <option value="Blockchain">Blockchain</option>
              </>}
              {form.category === "Health" && <>
                <option value="Nutrition">Nutrition</option>
                <option value="Mental Wellness">Mental Wellness</option>
                <option value="Fitness Tips">Fitness Tips</option>
              </>}
              {form.category === "Lifestyle" && <>
                <option value="Travel">Travel</option>
                <option value="Fashion & Beauty">Fashion & Beauty</option>
                <option value="Home Decor">Home Decor</option>
              </>}
            </select>
            <div className="flex justify-between mt-6">
              <button onClick={goBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
              <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Continue</button>
            </div>
          </motion.div>
        )}

        {/* Placeholder for Steps 3–6 can be added similarly */}
      </div>
    </div>
  );
}