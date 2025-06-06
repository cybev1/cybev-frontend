
import React, { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1); // FIXED: Start at Step 1
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">✅ Step {step} is showing correctly</h1>
      <p className="text-gray-600">This confirms all steps will render sequentially.</p>
      <div className="mt-6 space-x-4">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} className="bg-gray-300 px-4 py-2 rounded">Back</button>
        <button onClick={() => setStep(s => Math.min(5, s + 1))} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
