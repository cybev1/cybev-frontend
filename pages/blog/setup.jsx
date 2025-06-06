
import React, { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);

  const renderStep = () => {
    if (step === 1) return <div>Step 1: Domain setup (restored)</div>;
    if (step === 2) return <div>Step 2: Blog Identity (restored)</div>;
    if (step === 3) return <div>Step 3: Template + Monetize (restored)</div>;
    if (step === 4) return <div>Step 4: Preview (restored)</div>;
    if (step === 5) return (
      <div>
        Step 5: Hosting & Payment
        <button onClick={() => alert('Pay with Paystack')}>Pay Now</button>
      </div>
    );
    return <div>Unknown Step</div>;
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 rounded">Back</button>}
        {step < 5 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
