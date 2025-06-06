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
    paymentMethod: '',
  });

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <div><h2>Step 1: Domain Setup</h2></div>;
      case 2:
        return <div><h2>Step 2: Blog Identity</h2></div>;
      case 3:
        return <div><h2>Step 3: Design & Branding</h2></div>;
      case 4:
        return <div><h2>Step 4: Blog Preview</h2></div>;
      case 5:
        return <div><h2>Step 5: Hosting & Monetization</h2></div>;
      case 6:
        return <div><h2>Step 6: Confirm & Publish</h2></div>;
      default:
        return <div><h2>Start your blog setup</h2></div>;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step > 1 && <button onClick={goBack}>Back</button>}
        {step < 6 && <button onClick={goNext}>Next</button>}
      </div>
    </div>
  );
}
