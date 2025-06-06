
import { useState, useEffect } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    domainType: 'subdomain',
    subdomain: '', existingDomain: '', newDomain: '', domainAvailable: null,
    title: '', description: '', category: '', niche: '', template: '', logo: null,
    monetize: false, hostingPlan: null, paymentMethod: 'paystack'
  });
  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => s - 1);
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleDomainInput = e => {
    const value = e.target.value;
    const key = form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain';
    setForm(f => ({ ...f, [key]: value }));
    setAvailabilityMsg('');
    if (typingTimeout) clearTimeout(typingTimeout);
    const full = form.domainType === 'subdomain' ? `${value}.cybev.io` : value;
    setTypingTimeout(setTimeout(() => {
      fetch(`/api/hosting/domain-check?domain=${full}`).then(r => r.json()).then(d => setAvailabilityMsg(d.message)).catch(() => setAvailabilityMsg("Could not check domain."));
    }, 600));
  };

  const handlePayment = () => {
    setShowModal(false);
    alert(`Processing ${form.paymentMethod.toUpperCase()} payment for ${selectedPlan.name} (${selectedPlan.price})`);
    window.location.href = "/blog/confirm";
  };

  const plans = [
    { id: 'basic', type: 'Web Hosting', name: 'Basic Plan', price: '$5/month', features: ['1 Website', '10GB SSD', 'Free SSL'] },
    { id: 'pro', type: 'Web Hosting', name: 'Pro Plan', price: '$10/month', features: ['5 Websites', '50GB SSD', 'Priority Support'] },
    { id: 'premium', type: 'Web Hosting', name: 'Premium Plan', price: '$20/month', features: ['Unlimited Sites', '200GB SSD', 'Daily Backup'] },
    { id: 'vps_start', type: 'VPS Hosting', name: 'VPS Starter', price: '$25/month', features: ['2 vCPU', '4GB RAM', '80GB SSD'] },
    { id: 'vps_standard', type: 'VPS Hosting', name: 'VPS Standard', price: '$40/month', features: ['4 vCPU', '8GB RAM', '160GB SSD'] },
    { id: 'vps_pro', type: 'VPS Hosting', name: 'VPS Pro', price: '$70/month', features: ['8 vCPU', '16GB RAM', '320GB SSD'] },
    { id: 'free', type: 'Free Hosting', name: 'FREE HOSTING', price: '$0/month', features: ['Subdomain Only', '500MB Storage', 'Free SSL'], subdomainOnly: true }
  ];

  const renderStep5 = () => (
    <>
      <h1 className="text-xl font-bold mb-4">Step 5: Hosting & Payment</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-lg">{p.name}</h2>
            <p className="text-sm">{p.type}</p>
            <p className="text-blue-600 font-bold">{p.price}</p>
            <ul className="text-sm mt-2">{p.features.map((f, i) => <li key={i}>- {f}</li>)}</ul>
            <button
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setSelectedPlan(p);
                setShowModal(true);
              }}
            >Select Plan</button>
          </div>
        ))}
      </div>
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Pay with {form.paymentMethod}</h2>
            <p className="text-sm mb-2">Selected: {selectedPlan.name} - {selectedPlan.price}</p>
            <select className="border p-2 w-full mb-4" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option value="paystack">Paystack</option>
              <option value="cryptomus">Cryptomus</option>
              <option value="manual">Manual</option>
            </select>
            <div className="flex justify-between">
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handlePayment}>Pay Now</button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6">
        <button onClick={goBack} className="bg-gray-400 text-white px-6 py-2 rounded">Back</button>
      </div>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">CYBEV Blog Setup</h1>
      {step === 5 ? renderStep5() : <div className="text-gray-500">Steps 1-4 UI components go here...</div>}
    </div>
  );
}
