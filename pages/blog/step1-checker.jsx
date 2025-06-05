
import { useState, useEffect } from 'react';

export default function Step1DomainChecker() {
  const [domainType, setDomainType] = useState('subdomain');
  const [domainInput, setDomainInput] = useState('');
  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleDomainInput = (e) => {
    const value = e.target.value;
    setDomainInput(value);
    setAvailabilityMsg('');

    if (typingTimeout) clearTimeout(typingTimeout);

    const fullDomain = domainType === 'subdomain' ? `${value}.cybev.io` : value;

    setTypingTimeout(setTimeout(() => {
      fetch(`/api/hosting/domain-check?domain=${fullDomain}`)
        .then(res => res.json())
        .then(data => setAvailabilityMsg(data.message))
        .catch(() => setAvailabilityMsg("❌ Could not check domain."));
    }, 600));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-2">Step 1: Choose Your Domain</h1>
      <p className="text-gray-600 mb-4">This is how people will find you online.</p>

      <select
        value={domainType}
        onChange={e => setDomainType(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="subdomain">Use Free Subdomain</option>
        <option value="existing">Use Existing Domain</option>
        <option value="register">Register New Domain</option>
      </select>

      {domainType === 'subdomain' && (
        <input
          type="text"
          placeholder="Enter subdomain (e.g., myblog)"
          className="border p-2 rounded w-full"
          value={domainInput}
          onChange={handleDomainInput}
        />
      )}

      {domainType !== 'subdomain' && (
        <input
          type="text"
          placeholder="Enter your domain"
          className="border p-2 rounded w-full"
          value={domainInput}
          onChange={handleDomainInput}
        />
      )}

      {availabilityMsg && (
        <p className={`mt-2 text-sm ${availabilityMsg.includes('🎉') ? 'text-green-600' : 'text-red-600'}`}>
          {availabilityMsg}
        </p>
      )}
    </div>
  );
}
