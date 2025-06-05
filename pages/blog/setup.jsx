
import { useState } from 'react';

export default function BlogSetupExtended() {
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

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const uploadLogo = (e) => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, logo: file }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      {/* Step 1: Domain Selection with Live Checker */}
      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 1: Domain Setup</h1>
          <p className="text-gray-600 mb-4">This is how people will find you online.</p>

          {/* Domain Type & Input */}
          {/* Live availability checker will go here */}

          <div className="flex justify-between mt-6">
            <span></span>
            <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
          </div>
        </>
      )}

      {/* Step 2: Blog Identity */}
      {step === 2 && (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 2: Blog Identity</h1>
          <p className="text-gray-600 mb-4">This is your blog's name and details.</p>

          {/* Title, AI Generate Description, Category, Niche */}

          <div className="flex justify-between mt-6">
            <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
            <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
          </div>
        </>
      )}

      {/* Step 3: Appearance & Logo Upload */}
      {step === 3 && (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 3: Appearance</h1>
          <p className="text-gray-600 mb-4">Choose how your blog will look and feel.</p>

          {/* Template Previews, Upload Logo, Monetization */}

          <div className="flex justify-between mt-6">
            <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
            <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
          </div>
        </>
      )}

      {/* Step 4: Preview Summary */}
      {step === 4 && (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 4: Preview</h1>
          <p className="text-gray-600 mb-4">Here’s how your blog will look. You can go back to edit any part.</p>

          {/* Render summary of selected inputs (title, domain, category, etc.) */}

          <div className="flex justify-between mt-6">
            <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
            <button onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
          </div>
        </>
      )}

      {/* Step 5: Hosting Plan or Skip */}
      {step === 5 && (
        <>
          <h1 className="text-2xl font-bold mb-4">Step 5: Hosting</h1>
          <p className="text-gray-600 mb-4">Choose a hosting plan or skip if using a free subdomain.</p>

          {/* Hosting Plan Selector */}

          <div className="flex justify-between mt-6">
            <button onClick={goBack} className="bg-gray-300 text-black px-6 py-2 rounded">Back</button>
            <button onClick={() => console.log('Publishing blog...', form)} className="bg-green-600 text-white px-6 py-2 rounded">Publish</button>
          </div>
        </>
      )}
    </div>
  );
}
