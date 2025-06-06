import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CYBEV Blog Setup</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <p className="text-gray-700">This is Step {step} content</p>
        {step === 1 && <p>Step 1: Domain Setup Form...</p>}
        {step === 2 && <p>Step 2: Blog Identity Form...</p>}
        {step === 3 && <p>Step 3: Design & Branding...</p>}
        {step === 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 border rounded-xl shadow">
              <h4 className="text-gray-500 font-medium">Domain</h4>
              <p className="text-blue-700 font-semibold mt-1">myblog.cybev.io</p>
            </div>
            <div className="p-4 border rounded-xl shadow">
              <h4 className="text-gray-500 font-medium">Title</h4>
              <p className="text-gray-800 font-semibold mt-1">Living Faith Daily</p>
            </div>
            <div className="p-4 border rounded-xl shadow col-span-2">
              <h4 className="text-gray-500 font-medium">SEO Description</h4>
              <p className="text-gray-700 mt-1">Discover insights and updates...</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">
            Back
          </button>
        )}
        {step < 5 && (
          <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
