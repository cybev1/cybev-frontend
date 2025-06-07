
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Setup() {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  const steps = [
    <div key="step1" className="space-y-4">
      <h2 className="text-xl font-bold">Step 1: Domain Setup</h2>
      <input className="w-full p-2 border rounded" placeholder="Enter subdomain..." />
    </div>,
    <div key="step2" className="space-y-4">
      <h2 className="text-xl font-bold">Step 2: Blog Info</h2>
      <input className="w-full p-2 border rounded" placeholder="Blog title" />
    </div>,
    <div key="step3" className="space-y-4">
      <h2 className="text-xl font-bold">Step 3: Design</h2>
      <div className="h-24 bg-gray-200 rounded" />
    </div>,
    <div key="step4" className="space-y-4">
      <h2 className="text-xl font-bold">Step 4: Preview</h2>
      <div className="p-4 border rounded bg-white">Your preview card...</div>
    </div>,
    <div key="step5" className="space-y-4">
      <h2 className="text-xl font-bold">Step 5: Hosting</h2>
      <button className="w-full bg-blue-600 text-white py-2 rounded">Publish</button>
    </div>,
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">CYBEV Blog Setup – Step {step} of 5</h1>

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full"
          >
            {steps[step - 1]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button onClick={goBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        )}
        {step < 5 && (
          <button onClick={goNext} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
        )}
      </div>
    </div>
  );
}
