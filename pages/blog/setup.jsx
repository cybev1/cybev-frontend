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

  const checkDomainAvailability = (domain) => {
    // Simulated check (replace with actual API call)
    if (!domain) {
      setForm(prev => ({ ...prev, domainAvailable: null }));
      setAvailabilityMsg('');
      return;
    }

    setAvailabilityMsg('Checking availability...');
    setTimeout(() => {
      const isAvailable = !domain.includes("taken"); // simulate check
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

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 1: Domain Setup</h2>
          <p className="text-sm text-gray-600">This is how people will find you online</p>

          <div>
            <label className="block font-medium">Domain Type</label>
            <select
              name="domainType"
              value={form.domainType}
              onChange={(e) => setForm(prev => ({ ...prev, domainType: e.target.value }))}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="subdomain">Use a Free Subdomain</option>
              <option value="existing">Use My Existing Domain</option>
              <option value="register">Register a New Domain</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">
              {form.domainType === 'subdomain' ? 'Choose Subdomain' :
                form.domainType === 'existing' ? 'Enter Your Existing Domain' : 'Search for New Domain'}
            </label>
            <input
              type="text"
              name={
                form.domainType === 'subdomain' ? 'subdomain' :
                form.domainType === 'existing' ? 'existingDomain' : 'newDomain'
              }
              value={
                form.domainType === 'subdomain' ? form.subdomain :
                form.domainType === 'existing' ? form.existingDomain : form.newDomain
              }
              onChange={handleDomainInput}
              placeholder={form.domainType === 'subdomain' ? 'e.g. myblog' : 'e.g. example.com'}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {availabilityMsg && (
            <p className={`text-sm ${form.domainAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {availabilityMsg}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="text-lg font-medium">
        Step {step} content will go here...
      </div>
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step > 1 && <button onClick={goBack} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
        {step < 6 && <button onClick={goNext} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
