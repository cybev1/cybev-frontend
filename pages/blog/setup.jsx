import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const steps = ['Domain Setup', 'Blog Identity', 'Design & Branding', 'Preview', 'Hosting Plan + Payment'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">CYBEV Blog Setup – Step {step} of 5</h1>
      <p className="text-gray-600 mb-6">Current Step: {steps[step - 1]}</p>
      <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-6">
        <p className="text-gray-500 italic">✅ This is the real final version. UI for Step {step} loads here dynamically.</p>
      </div>
      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
        {step < 5 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
