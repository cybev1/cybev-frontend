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
    category: 'Christianity',
    niche: 'Devotionals',
    otherNiche: '',
    template: 'simple.png',
    logoPreview: '/logo-preview.png',
    monetize: true
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

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
      if (!value) {
        setAvailabilityMsg('');
        return;
      }
      const isTaken = value.toLowerCase().includes("taken");
      setAvailabilityMsg(
        isTaken
          ? `❌ ${domain} is already taken.`
          : `✅ Congratulations! ${domain} is available.`
      );
    }, 500);
    setTypingTimeout(timeout);
  };

  const domain =
    form.domainType === 'subdomain'
      ? `${form.subdomain}.cybev.io`
      : form.domainType === 'existing'
      ? form.existingDomain
      : form.newDomain;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Step {step}: CYBEV Blog Setup</h2>

      {step === 1 && (
        <div className="space-y-4">
          <select name="domainType" className="w-full border px-3 py-2 rounded" value={form.domainType} onChange={handleChange}>
            <option value="subdomain">Use Free Subdomain</option>
            <option value="existing">Use Existing Domain</option>
            <option value="register">Register New Domain</option>
          </select>
          <input
            name={form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain'}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter domain or subdomain"
            value={
              form.domainType === 'subdomain'
                ? form.subdomain
                : form.domainType === 'existing'
                ? form.existingDomain
                : form.newDomain
            }
            onChange={handleDomainInput}
          />
          {availabilityMsg && (
            <p className={`text-sm transition ${
              availabilityMsg.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}>
              {availabilityMsg}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">
            Back
          </button>
        )}
        {step < 5 && (
          <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
