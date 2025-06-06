
import React, { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Step {step}</h1>
      <p className="text-gray-600 mb-6">This is a placeholder for full setup flow.</p>
      <div className="flex justify-between">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        )}
        {step < 5 && (
          <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
        )}
        {step === 5 && (
          <button className="px-4 py-2 bg-green-600 text-white rounded">Finish</button>
        )}
      </div>
    </div>
  );
}
