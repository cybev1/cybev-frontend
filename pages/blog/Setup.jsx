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
    niche: ''
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
    }, 2000); // simulate delay
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white text-black p-6 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-2 text-center">Step 1 – Domain Setup</h2>
            <p className="mb-6 text-gray-600 text-center">This is how people will find you online</p>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Choose Domain Type:</label>
              <select name="domainType" value={form.domainType} onChange={handleDomainTypeChange} className="p-3 border border-gray-300 rounded-lg w-full">
                <option value="subdomain">Use a free subdomain (.cybev.io)</option>
                <option value="existingDomain">Use an existing domain</option>
                <option value="newDomain">Register a new domain</option>
              </select>
            </div>

            {form.domainType === 'subdomain' && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Subdomain:</label>
                <input type="text" name="subdomain" placeholder="e.g. yourname" value={form.subdomain} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full" />
                {availabilityMsg && <p className="mt-2 text-green-600 font-medium">{availabilityMsg}</p>}
              </div>
            )}

            {form.domainType === 'existingDomain' && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Your Domain:</label>
                <input type="text" name="existingDomain" placeholder="e.g. example.com" value={form.existingDomain} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full" />
                {availabilityMsg && <p className="mt-2 text-green-600 font-medium">{availabilityMsg}</p>}
              </div>
            )}

            {form.domainType === 'newDomain' && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">New Domain Name:</label>
                <input type="text" name="newDomain" placeholder="e.g. newsite.com" value={form.newDomain} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full" />
                {availabilityMsg && <p className="mt-2 text-green-600 font-medium">{availabilityMsg}</p>}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <div></div>
              <button onClick={nextStep} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition">Continue</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-2 text-center">Step 2 – Blog Identity</h2>
            <p className="mb-6 text-gray-600 text-center">This is your business/brand name or what people will call your blog</p>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Blog Title:</label>
              <input type="text" name="title" placeholder="e.g. Tech Digest" value={form.title} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full" />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">SEO Description:</label>
              <textarea name="description" placeholder="Short description for search engines..." value={form.description} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full" />
              <button onClick={handleAIGenerate} className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                {aiGenerating ? 'Generating...' : 'AI Generate SEO'}
              </button>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Category:</label>
              <select name="category" value={form.category} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full">
                <option value="">Select Category</option>
                <option value="Christianity">Christianity</option>
                <option value="Tech">Tech</option>
                <option value="Health">Health</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Niche:</label>
              <select name="niche" value={form.niche} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full">
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
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={goBack} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Back</button>
              <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Continue</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}