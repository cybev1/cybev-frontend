
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
    template: '',
    logo: null,
    monetize: false,
    hostingPlan: null,
  });
  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const steps = [
    <div key="step1" className="p-4 rounded-2xl shadow bg-white">Step 1: Domain Setup – includes domain checker and congratulatory message</div>,
    <div key="step2" className="p-4 rounded-2xl shadow bg-white">Step 2: Blog Identity – SEO AI button, category/niche dropdown</div>,
    <div key="step3" className="p-4 rounded-2xl shadow bg-white">Step 3: Design & Branding – Template previews, logo upload, monetize checkbox</div>,
    <div key="step4" className="p-4 rounded-2xl shadow bg-white">Step 4: Blog Preview – visual preview cards</div>,
    <div key="step5" className="p-4 rounded-2xl shadow bg-white">Step 5: Hosting Plan Selection – 3 Web, 3 VPS, Free Hosting, payments</div>
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">CYBEV Blog Setup – Step {step} of 5</h1>
      {steps[step - 1]}
      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={goBack} className="px-4 py-2 rounded bg-gray-300">Back</button>}
        {step < 5 && <button onClick={goNext} className="px-4 py-2 rounded bg-blue-600 text-white">Next</button>}
        {step === 5 && <button className="px-4 py-2 rounded bg-green-600 text-white">Publish My Blog</button>}
      </div>
    </div>
  );
}
