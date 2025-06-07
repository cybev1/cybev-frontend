import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Setup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: '',
    existingDomain: '',
    newDomain: '',
    domainAvailable: null
  });
  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const checkDomainAvailability = (domain) => {
    // Simulated domain checker
    if (domain.length > 3) {
      setForm(prev => ({ ...prev, domainAvailable: true }));
      setAvailabilityMsg(`🎉 Congratulations! ${domain} is available`);
    } else {
      setForm(prev => ({ ...prev, domainAvailable: false }));
      setAvailabilityMsg('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'subdomain' || name === 'existingDomain' || name === 'newDomain') {
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

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold mb-4">Step 1 – Domain Setup</h2>
          <p className="mb-4 text-gray-600">This is how people will find you online</p>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Choose Domain Type:</label>
            <select name="domainType" value={form.domainType} onChange={handleDomainTypeChange} className="p-2 border rounded w-full">
              <option value="subdomain">Use a free subdomain (.cybev.io)</option>
              <option value="existingDomain">Use an existing domain</option>
              <option value="newDomain">Register a new domain</option>
            </select>
          </div>

          {form.domainType === 'subdomain' && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">Subdomain:</label>
              <input
                type="text"
                name="subdomain"
                placeholder="e.g. yourname"
                value={form.subdomain}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {availabilityMsg && <p className="mt-2 text-green-600">{availabilityMsg}</p>}
            </div>
          )}

          {form.domainType === 'existingDomain' && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">Your Domain:</label>
              <input
                type="text"
                name="existingDomain"
                placeholder="e.g. example.com"
                value={form.existingDomain}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {availabilityMsg && <p className="mt-2 text-green-600">{availabilityMsg}</p>}
            </div>
          )}

          {form.domainType === 'newDomain' && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">New Domain Name:</label>
              <input
                type="text"
                name="newDomain"
                placeholder="e.g. newsite.com"
                value={form.newDomain}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {availabilityMsg && <p className="mt-2 text-green-600">{availabilityMsg}</p>}
            </div>
          )}

          <button onClick={nextStep} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Continue
          </button>
        </motion.div>
      )}
    </div>
  );
}