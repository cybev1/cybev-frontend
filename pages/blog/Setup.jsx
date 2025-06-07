
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Setup() {
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
    monetize: false
  });

  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  const checkDomainAvailability = (domain) => {
    if (domain.length > 3) {
      setForm(prev => ({ ...prev, domainAvailable: true }));
      setAvailabilityMsg('🎉 Congratulations! The domain is available');
    } else {
      setForm(prev => ({ ...prev, domainAvailable: false }));
      setAvailabilityMsg('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (['subdomain', 'existingDomain', 'newDomain'].includes(name)) {
      clearTimeout(typingTimeout);
      const timeout = setTimeout(() => checkDomainAvailability(value), 1000);
      setTypingTimeout(timeout);
    }
  };

  const handleDomainTypeChange = (e) => {
    const { value } = e.target;
    setForm(prev => ({ ...prev, domainType: value, domainAvailable: null }));
    setAvailabilityMsg('');
  };

  const nextStep = () => setStep(step + 1);
  const goBack = () => setStep(step - 1);

  const handleAIGenerate = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setForm(prev => ({ ...prev, description: 'Welcome to a blog that inspires and informs. Discover amazing content crafted for your success.' }));
      setAiGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white text-black p-6 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-2 text-center">Step 1 – Domain Setup</h2>
            <p className="mb-6 text-gray-600 text-center">This is how people will find you online</p>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Choose Domain Type:</label>
              <select name="domainType" value={form.domainType} onChange={handleDomainTypeChange} className="p-3 border border-gray-300 rounded-lg w-full">
                <option value="subdomain">Use a free subdomain (.cybev.io)</option>
                <option value="existingDomain">Use an existing domain</option>
                <option value="newDomain">Register a new domain</option>
              </select>
            </div>
            {(form.domainType === 'subdomain' || form.domainType === 'existingDomain' || form.domainType === 'newDomain') && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">
                  {form.domainType === 'subdomain' ? 'Subdomain:' :
                   form.domainType === 'existingDomain' ? 'Your Domain:' : 'New Domain Name:'}
                </label>
                <input
                  type="text"
                  name={form.domainType}
                  placeholder={form.domainType === 'subdomain' ? 'e.g. yourname' :
                              form.domainType === 'existingDomain' ? 'e.g. example.com' : 'e.g. newsite.com'}
                  value={form[form.domainType]}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-lg w-full"
                />
                {availabilityMsg && <p className="mt-2 text-green-600 font-medium">{availabilityMsg}</p>}
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button onClick={nextStep} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition">Continue</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-2 text-center">Step 2 – Blog Identity</h2>
            <p className="mb-6 text-gray-600 text-center">This is your business/brand name or what people will call your blog</p>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Blog Title:</label>
              <input type="text" name="title" placeholder="e.g. Tech Digest" value={form.title} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">SEO Description:</label>
              <textarea name="description" placeholder="Short description for search engines..." value={form.description} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full" />
              <button onClick={handleAIGenerate} className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                {aiGenerating ? 'Generating...' : 'AI Generate SEO'}
              </button>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Category:</label>
              <select name="category" value={form.category} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full">
                <option value="">Select Category</option>
                <option value="Christianity">Christianity</option>
                <option value="Tech">Tech</option>
                <option value="Health">Health</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Niche:</label>
              <select name="niche" value={form.niche} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-lg w-full">
                <option value="">Select Niche</option>
                {form.category === "Christianity" && <>
                  <option value="Faith & Healing">Faith & Healing</option>
                  <option value="Daily Devotionals">Daily Devotionals</option>
                  <option value="Christian Living">Christian Living</option>
                </>}
                {form.category === "Tech" && <>
                  <option value="AI Tools">AI Tools</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Blockchain">Blockchain</option>
                </>}
                {form.category === "Health" && <>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Mental Wellness">Mental Wellness</option>
                  <option value="Fitness Tips">Fitness Tips</option>
                </>}
                {form.category === "Lifestyle" && <>
                  <option value="Travel">Travel</option>
                  <option value="Fashion & Beauty">Fashion & Beauty</option>
                  <option value="Home Decor">Home Decor</option>
                </>}
              </select>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={goBack} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Back</button>
              <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Continue</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-2 text-center">Step 3 – Design & Branding</h2>
            <p className="mb-6 text-gray-600 text-center">This is how your website/blog will look like</p>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Select a Template:</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-xl overflow-hidden shadow cursor-pointer hover:shadow-lg transition" onClick={() => setForm(prev => ({ ...prev, template: 'modern' }))}>
                  <img src="https://via.placeholder.com/300x150?text=Modern+Template" alt="Modern Template" />
                  <div className="text-center py-2 bg-gray-100 font-semibold">Modern</div>
                </div>
                <div className="border rounded-xl overflow-hidden shadow cursor-pointer hover:shadow-lg transition" onClick={() => setForm(prev => ({ ...prev, template: 'classic' }))}>
                  <img src="https://via.placeholder.com/300x150?text=Classic+Template" alt="Classic Template" />
                  <div className="text-center py-2 bg-gray-100 font-semibold">Classic</div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Upload Logo (Optional):</label>
              <input type="file" accept="image/*" className="w-full p-2 border border-gray-300 rounded-lg" onChange={(e) => setForm(prev => ({ ...prev, logo: e.target.files[0] }))} />
            </div>
            <div className="mb-6 flex items-center space-x-3">
              <input type="checkbox" id="monetize" checked={form.monetize} onChange={(e) => setForm(prev => ({ ...prev, monetize: e.target.checked }))} className="w-5 h-5" />
              <label htmlFor="monetize" className="text-gray-700 font-medium">Enable Monetization for My Blog</label>
            </div>
            <div className="flex justify-between">
              <button onClick={goBack} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Back</button>
              <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Continue</button>
            </div>
          </motion.div>
        )}


        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-2 text-center">Step 4 – Preview Your Blog</h2>
            <p className="mb-6 text-gray-600 text-center">This is a preview of your blog before publishing</p>

            <div className="border rounded-2xl shadow-xl p-6 bg-gray-50 space-y-4">
              <h3 className="text-2xl font-semibold text-center">{form.title || 'Your Blog Title'}</h3>
              <p className="text-center text-gray-700">{form.description || 'Your blog description will appear here...'}</p>
              <div className="text-center">
                <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">{form.category || 'Category'}</span>
                {form.niche && (
                  <span className="inline-block ml-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">{form.niche}</span>
                )}
              </div>
              <div className="text-center mt-4">
                <img
                  src={
                    form.template === 'modern'
                      ? 'https://via.placeholder.com/600x300?text=Modern+Template+Preview'
                      : 'https://via.placeholder.com/600x300?text=Classic+Template+Preview'
                  }
                  alt="Template Preview"
                  className="mx-auto rounded-lg shadow-lg"
                />
              </div>
              {form.logo && (
                <div className="text-center">
                  <p className="mt-2 font-medium text-gray-700">Uploaded Logo:</p>
                  <img src={URL.createObjectURL(form.logo)} alt="Logo Preview" className="mx-auto h-20 mt-2" />
                </div>
              )}
              {form.monetize && (
                <div className="text-center text-yellow-600 font-semibold mt-4">
                  💰 Monetization is enabled for this blog.
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={goBack} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Back</button>
              <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Continue</button>
            </div>
          </motion.div>
        )}



        
{step === 5 && (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
    <h2 className="text-3xl font-bold mb-2 text-center">Step 5 – Hosting Plan</h2>
    <p className="mb-6 text-gray-600 text-center">Choose your preferred hosting plan or skip for now</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="border rounded-2xl shadow p-4 text-center">
        <h3 className="text-xl font-semibold mb-2">Starter Hosting</h3>
        <p className="text-gray-600 mb-2">Perfect for personal blogs</p>
        <p className="text-blue-600 font-bold text-lg mb-4">$5/mo</p>
        <button onClick={() => alert('Pay with CYBV')} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Pay with CYBV</button>
      </div>
      <div className="border rounded-2xl shadow p-4 text-center">
        <h3 className="text-xl font-semibold mb-2">Pro VPS</h3>
        <p className="text-gray-600 mb-2">For high-traffic blogs</p>
        <p className="text-blue-600 font-bold text-lg mb-4">$15/mo</p>
        <button onClick={() => alert('Pay with Paystack')} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Pay with Paystack</button>
      </div>
      <div className="border rounded-2xl shadow p-4 text-center">
        <h3 className="text-xl font-semibold mb-2">Premium VPS</h3>
        <p className="text-gray-600 mb-2">Max performance & speed</p>
        <p className="text-blue-600 font-bold text-lg mb-4">$25/mo</p>
        <button onClick={() => alert('Pay with Cryptomus')} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">Pay with Cryptomus</button>
      </div>
      <div className="border rounded-2xl shadow p-4 text-center border-dashed">
        <h3 className="text-xl font-semibold mb-2">FREE Hosting</h3>
        <p className="text-gray-600 mb-2">Only for subdomain users</p>
        <p className="text-green-600 font-bold text-lg mb-4">Free</p>
        <button onClick={() => alert('Publishing with Free Hosting')} className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800">Skip & Use Free Hosting</button>
      </div>
    </div>

    <div className="flex justify-between mt-8">
      <button onClick={goBack} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Back</button>
      <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Continue</button>
    </div>
  </motion.div>
)}



        {step === 6 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-center mb-4">Step 6 – Confirm & Publish</h2>
            <p className="text-center text-gray-600 mb-6">Everything looks good! Click below to publish your blog.</p>
            <div className="bg-green-100 border border-green-300 rounded-xl p-6 text-center">
              <h3 className="text-2xl font-semibold text-green-700 mb-2">🎉 Ready to Go!</h3>
              <p className="text-gray-800 mb-4">You're all set to publish your blog to the world.</p>
              <div className="flex justify-center gap-4">
                <button onClick={goBack} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Back</button>
                <button
  onClick={() => {
    fetch("https://api.cybev.io/blog/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("✅ Blog publish successful!");
        } else {
          alert("⚠️ Publish failed: " + (data.message || "Unknown error"));
        }
      })
      .catch(err => {
        alert("Something went wrong: " + err.message);
      });
  }}
  className="px-8 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
>
  🚀 Publish My Blog
</button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
