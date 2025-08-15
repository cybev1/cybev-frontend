import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function BlogBuilder() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'subdomain', // or 'custom'
    subdomain: '',
    customDomain: '',
    title: '',
    description: '',
    category: '',
    niche: '',
    template: 'creator',
    logo: '',
    monetize: true,
    hosting: 'cybev'
  });
  
  const [loading, setLoading] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState(null);
  const [niches, setNiches] = useState([
    'Technology', 'Lifestyle', 'Business', 'Health', 'Finance', 'Education',
    'Travel', 'Food', 'Fashion', 'Gaming', 'Crypto', 'AI', 'Web3', 'NFTs'
  ]);

  const [templates] = useState([
    { id: 'creator', name: 'Creator Portfolio', preview: '/templates/creator.jpg' },
    { id: 'magazine', name: 'Magazine Style', preview: '/templates/magazine.jpg' },
    { id: 'minimalist', name: 'Minimalist Blog', preview: '/templates/minimalist.jpg' },
    { id: 'business', name: 'Business Professional', preview: '/templates/business.jpg' }
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-check domain availability
    if (field === 'subdomain' && value.length > 2) {
      checkDomainAvailability(value);
    }
  };

  const checkDomainAvailability = async (domain) => {
    try {
      const response = await axios.get(`/api/domain/check?domain=${domain}`);
      setDomainAvailable(response.data.available);
    } catch (error) {
      console.error('Domain check failed:', error);
    }
  };

  const generateWithAI = async (type) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/generate', {
        type,
        context: { niche: formData.niche, title: formData.title }
      });
      
      if (type === 'title') {
        setFormData(prev => ({ ...prev, title: response.data.content }));
      } else if (type === 'description') {
        setFormData(prev => ({ ...prev, description: response.data.content }));
      }
      toast.success('AI content generated!');
    } catch (error) {
      toast.error('AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/blog/create', formData);
      toast.success('Blog created successfully!');
      
      // Redirect to blog dashboard
      window.location.href = `/studio/blogs/${response.data.blogId}`;
    } catch (error) {
      toast.error('Blog creation failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else createBlog();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= step ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {i}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                 style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        >
          {/* Step 1: Domain & Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Choose Your Domain</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Domain Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleInputChange('type', 'subdomain')}
                      className={`p-4 rounded-lg border-2 transition ${
                        formData.type === 'subdomain' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                          : 'border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold">Free Subdomain</h3>
                      <p className="text-sm text-gray-600">yourname.cybev.io</p>
                    </button>
                    <button
                      onClick={() => handleInputChange('type', 'custom')}
                      className={`p-4 rounded-lg border-2 transition ${
                        formData.type === 'custom' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                          : 'border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold">Custom Domain</h3>
                      <p className="text-sm text-gray-600">yoursite.com</p>
                    </button>
                  </div>
                </div>

                {formData.type === 'subdomain' ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">Subdomain</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={formData.subdomain}
                        onChange={(e) => handleInputChange('subdomain', e.target.value)}
                        className="flex-1 p-3 border rounded-l-lg dark:bg-gray-700"
                        placeholder="Enter subdomain"
                      />
                      <span className="p-3 bg-gray-100 dark:bg-gray-600 border rounded-r-lg">.cybev.io</span>
                    </div>
                    {domainAvailable !== null && (
                      <p className={`text-sm mt-2 ${domainAvailable ? 'text-green-500' : 'text-red-500'}`}>
                        {domainAvailable ? '✅ Available' : '❌ Not available'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">Custom Domain</label>
                    <input
                      type="text"
                      value={formData.customDomain}
                      onChange={(e) => handleInputChange('customDomain', e.target.value)}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700"
                      placeholder="example.com"
                    />
                    <p className="text-sm text-gray-500 mt-1">Domain registration: $12.99/year</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Blog Title</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="flex-1 p-3 border rounded-lg dark:bg-gray-700"
                      placeholder="My Awesome Blog"
                    />
                    <button
                      onClick={() => generateWithAI('title')}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                    >
                      ✨ AI
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <div className="flex gap-2">
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="flex-1 p-3 border rounded-lg dark:bg-gray-700"
                      rows={3}
                      placeholder="Describe your blog..."
                    />
                    <button
                      onClick={() => generateWithAI('description')}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                    >
                      ✨ AI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Category & Niche */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Choose Your Niche</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {niches.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => handleInputChange('niche', niche)}
                    className={`p-4 rounded-lg border-2 transition ${
                      formData.niche === niche 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Custom Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700"
                  placeholder="Or enter a custom category"
                />
              </div>
            </div>
          )}

          {/* Step 3: Template Selection */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Choose Template</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleInputChange('template', template.id)}
                    className={`p-4 rounded-lg border-2 transition ${
                      formData.template === template.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-500">Template Preview</span>
                    </div>
                    <h3 className="font-semibold">{template.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Final Settings */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Final Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.monetize}
                      onChange={(e) => handleInputChange('monetize', e.target.checked)}
                      className="mr-2"
                    />
                    <span>Enable monetization (AdSense + CYBEV ads)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Logo URL (optional)</label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p><strong>Domain:</strong> {formData.type === 'subdomain' ? `${formData.subdomain}.cybev.io` : formData.customDomain}</p>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Niche:</strong> {formData.niche}</p>
                  <p><strong>Template:</strong> {templates.find(t => t.id === formData.template)?.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={loading || (step === 1 && formData.type === 'subdomain' && !domainAvailable)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : (step === 4 ? 'Create Blog' : 'Next')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
