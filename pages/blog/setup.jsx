import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    domainType: 'subdomain',
    subdomain: '',
    existingDomain: '',
    newDomain: '',
    description: '',
    category: 'Christianity',
    niche: 'Devotionals',
    template: 'simple.png',
    logoPreview: '/logo-preview.png',
    monetize: true
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow border">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Step 1: Domain Setup</h2>
            <select name="domainType" className="w-full mb-4 border px-3 py-2 rounded" value={form.domainType}>
              <option value="subdomain">Use Free Subdomain</option>
              <option value="existing">Use Existing Domain</option>
              <option value="register">Register New Domain</option>
            </select>
            <input className="w-full border px-3 py-2 rounded" placeholder="Enter domain..." />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Step 2: Blog Identity</h2>
            <input className="w-full border px-3 py-2 rounded mb-3" value={form.title} placeholder="Blog Title" />
            <textarea className="w-full border px-3 py-2 rounded" value={form.description} placeholder="SEO Description" />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Step 3: Design & Branding</h2>
            <img src={form.logoPreview} className="h-16 bg-white rounded shadow" alt="Logo" />
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Step 4: Preview</h2>
            <p><strong>Title:</strong> {form.title}</p>
            <p><strong>Category:</strong> {form.category}</p>
            <p><strong>Niche:</strong> {form.niche}</p>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Step 5: Hosting Plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded shadow">
                <h3 className="font-bold text-blue-600">Web Starter</h3>
                <p>20 CYBV — 1 Site, 5GB</p>
              </div>
              <div className="p-4 border rounded shadow">
                <h3 className="font-bold text-green-600">Pay with CYBV</h3>
                <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">Pay Now</button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
        {step < 5 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
      </div>
    </div>
  );
}
