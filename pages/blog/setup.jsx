
import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

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
    template: '',
    logo: null,
    monetize: false,
    hostingPlan: null,
    paymentMethod: 'paystack',
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const paystackRef = useRef(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDomainInput = (e) => {
    const value = e.target.value;
    const domainKey = form.domainType === 'subdomain' ? 'subdomain' : form.domainType === 'existing' ? 'existingDomain' : 'newDomain';

    setForm(prev => ({
      ...prev,
      [domainKey]: value
    }));

    setAvailabilityMsg('');
    if (typingTimeout) clearTimeout(typingTimeout);

    const fullDomain = form.domainType === 'subdomain' ? `${value}.cybev.io` : value;

    setTypingTimeout(setTimeout(() => {
      fetch(`/api/hosting/domain-check?domain=${fullDomain}`)
        .then(res => res.json())
        .then(data => setAvailabilityMsg(data.message))
        .catch(() => setAvailabilityMsg("Could not check domain."));
    }, 600));
  };

  const handlePayment = () => {
    setShowModal(false);
    const handler = window.PaystackPop && window.PaystackPop.setup({
      key: 'pk_test_xxxx', // Replace with your Paystack public key
      email: 'user@example.com',
      amount: parseInt(selectedPlan.price.replace(/[^0-9]/g, '')) * 100,
      currency: 'USD',
      callback: function(response) {
        alert('Payment successful: ' + response.reference);
        window.location.href = "/blog/confirm";
      },
      onClose: function() {
        alert('Payment window closed');
      }
    });
    handler && handler.openIframe();
  };

  const renderPaymentModal = () => (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
          <p>You're about to pay for <strong>{selectedPlan?.name}</strong> ({selectedPlan?.price}).</p>
          <div className="mt-4 flex justify-end space-x-3">
            <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button onClick={handlePayment} className="bg-green-600 text-white px-4 py-2 rounded">Pay Now</button>
          </div>
        </div>
      </div>
    )
  );

  const plans = [
    { id: 'basic', type: 'Web Hosting', name: 'Basic Plan', price: '$5', features: ['1 Website', '10GB SSD', 'Free SSL'] },
    { id: 'pro', type: 'Web Hosting', name: 'Pro Plan', price: '$10', features: ['5 Websites', '50GB SSD', 'Priority Support'] },
    { id: 'premium', type: 'Web Hosting', name: 'Premium Plan', price: '$20', features: ['Unlimited Sites', '200GB SSD', 'Daily Backup'] },
    { id: 'vps_start', type: 'VPS Hosting', name: 'VPS Starter', price: '$25', features: ['2 vCPU', '4GB RAM', '80GB SSD'] },
    { id: 'vps_standard', type: 'VPS Hosting', name: 'VPS Standard', price: '$40', features: ['4 vCPU', '8GB RAM', '160GB SSD'] },
    { id: 'vps_pro', type: 'VPS Hosting', name: 'VPS Pro', price: '$70', features: ['8 vCPU', '16GB RAM', '320GB SSD'] },
    { id: 'free', type: 'Free Hosting', name: 'FREE HOSTING', price: '$0', features: ['Subdomain Only', '500MB Storage', 'Free SSL'], subdomainOnly: true }
  ];

  const renderStep5 = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Step 5: Hosting & Payment</h1>
      <p className="text-gray-600 mb-6">Choose a plan or use free hosting if using a subdomain.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {plans.map(plan => (
          <div key={plan.id} className="border rounded-xl p-5 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-sm text-gray-500">{plan.type}</p>
            <p className="text-lg font-semibold text-blue-700 mb-2">{plan.price}</p>
            <ul className="text-sm text-gray-700 mb-3">
              {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <button
              onClick={() => {
                if (plan.subdomainOnly && form.domainType !== 'subdomain') {
                  alert('This plan is only available for subdomain users.');
                } else {
                  setSelectedPlan(plan);
                  setShowModal(true);
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="bg-gray-300 px-6 py-2 rounded">Back</button>
      </div>
      {renderPaymentModal()}
      <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
    </>
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow rounded">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </div>
  );
}
