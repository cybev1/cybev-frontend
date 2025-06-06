
import { useState, useEffect } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: '',
    existingDomain: '',
    newDomain: '',
    domainAvailable: null,
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'subdomain' || name === 'existingDomain' || name === 'newDomain') {
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(() => {
        setAvailabilityMsg("🎉 Domain is available");
        setForm((prev) => ({ ...prev, domainAvailable: true }));
      }, 1000));
    }
  };

  const renderDomainInput = () => {
    if (form.domainType === 'subdomain') {
      return (
        <>
          <label className="block mt-4">Enter Subdomain:</label>
          <input
            type="text"
            name="subdomain"
            placeholder="myblog"
            value={form.subdomain}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {form.domainAvailable && <p className="text-green-600 mt-2">{availabilityMsg}</p>}
        </>
      );
    } else if (form.domainType === 'existing') {
      return (
        <>
          <label className="block mt-4">Enter Your Existing Domain:</label>
          <input
            type="text"
            name="existingDomain"
            placeholder="example.com"
            value={form.existingDomain}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {form.domainAvailable && <p className="text-green-600 mt-2">{availabilityMsg}</p>}
        </>
      );
    } else if (form.domainType === 'register') {
      return (
        <>
          <label className="block mt-4">Register New Domain:</label>
          <input
            type="text"
            name="newDomain"
            placeholder="example.com"
            value={form.newDomain}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {form.domainAvailable && <p className="text-green-600 mt-2">{availabilityMsg}</p>}
        </>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">CYBEV Blog Setup – Step {step} of 5</h1>
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow p-6">
          <label className="block">Domain Type:</label>
          <select
            name="domainType"
            value={form.domainType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="subdomain">Use a free subdomain</option>
            <option value="existing">Use an existing domain</option>
            <option value="register">Register a new domain</option>
          </select>

          {renderDomainInput()}
        </div>
      )}

      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={goBack} className="px-4 py-2 rounded bg-gray-300">Back</button>}
        {step < 5 && <button onClick={goNext} className="px-4 py-2 rounded bg-blue-600 text-white">Next</button>}
        {step === 5 && <button className="px-4 py-2 rounded bg-green-600 text-white">Publish My Blog</button>}
      </div>
    </div>
  );
}
