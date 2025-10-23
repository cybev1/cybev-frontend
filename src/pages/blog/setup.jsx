import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function BlogSetup() {
  const router = useRouter();
  const { template } = router.query;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [domainChecking, setDomainChecking] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState(null);
  const [checkTimeout, setCheckTimeout] = useState(null);
  
  const [blogData, setBlogData] = useState({
    name: '',
    tagline: '',
    category: '',
    isMinistry: false,
    churchName: '',
    denomination: '',
    location: '',
    domainType: 'subdomain',
    subdomain: '',
    customDomain: '',
    domainAvailable: false
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const categories = [
    { id: 'christianity', label: '✝️ Christianity', type: 'ministry' },
    { id: 'theology', label: '📖 Theology', type: 'ministry' },
    { id: 'missions', label: '🌍 Missions', type: 'ministry' },
    { id: 'prayer', label: '🙏 Prayer & Worship', type: 'ministry' },
    { id: 'bible-study', label: '📚 Bible Study', type: 'ministry' },
    { id: 'youth-ministry', label: '👥 Youth Ministry', type: 'ministry' },
    { id: 'church-leadership', label: '⛪ Church Leadership', type: 'ministry' },
    { id: 'technology', label: '💻 Technology', type: 'general' },
    { id: 'ai', label: '🤖 AI & Machine Learning', type: 'general' },
    { id: 'web3', label: '🌐 Web3 & Crypto', type: 'general' },
    { id: 'design', label: '🎨 Design', type: 'general' },
    { id: 'business', label: '💼 Business', type: 'general' },
    { id: 'lifestyle', label: '✨ Lifestyle', type: 'general' },
    { id: 'health', label: '🏋️ Health & Fitness', type: 'general' },
    { id: 'travel', label: '✈️ Travel', type: 'general' },
    { id: 'food', label: '🍔 Food & Cooking', type: 'general' },
    { id: 'photography', label: '📷 Photography', type: 'general' }
  ];

  // Debounced domain check
  const checkDomainAvailability = useCallback(async (domain) => {
    if (!domain || domain.length < 3) {
      setDomainAvailable(null);
      return;
    }

    // Clear existing timeout
    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    // Set new timeout for debouncing
    const newTimeout = setTimeout(async () => {
      setDomainChecking(true);
      
      try {
        const fullDomain = blogData.domainType === 'subdomain' ? `${domain}.cybev.io` : domain;
        
        const response = await axios.post('/api/domains/check', { domain: fullDomain });
        
        if (response.data.ok) {
          setDomainAvailable(response.data.available);
        } else {
          setDomainAvailable(false);
        }
      } catch (err) {
        console.error('Domain check error:', err);
        setDomainAvailable(true);
        toast.info('Domain check unavailable, will be verified during creation');
      } finally {
        setDomainChecking(false);
      }
    }, 500); // Wait 500ms after user stops typing

    setCheckTimeout(newTimeout);
  }, [blogData.domainType, checkTimeout]);

  const handleNext = () => {
    if (step === 1 && !blogData.name) {
      toast.error('Please enter a blog name');
      return;
    }
    if (step === 2 && !blogData.category) {
      toast.error('Please select a category');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to continue');
        router.push('/auth/login');
        return;
      }

      const blogPayload = {
        title: blogData.name,
        tagline: blogData.tagline,
        category: blogData.category,
        template: template || 'default',
        domainType: blogData.domainType,
        subdomain: blogData.subdomain,
        customDomain: blogData.customDomain,
        isMinistry: blogData.isMinistry,
        churchName: blogData.churchName,
        denomination: blogData.denomination,
        location: blogData.location
      };

      console.log('Creating blog with:', blogPayload);

      const response = await axios.post(
        `${API_URL}/api/blogs`,
        blogPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        toast.success('🎉 Blog created successfully!');

        // Try to award tokens (don't block if it fails)
        try {
          await axios.post(
            `${API_URL}/api/rewards/award`,
            { action: 'blog_created', amount: 100 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('🪙 Earned 100 CYBEV tokens!');
        } catch (err) {
          console.log('Token reward pending - endpoint may not be implemented yet');
        }

        router.push(`/blog/${response.data.blog._id || response.data.blogId}`);
      } else {
        toast.error(response.data.error || 'Failed to create blog');
      }
    } catch (err) {
      console.error('Blog creation error:', err);
      toast.error(err.response?.data?.error || 'Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipDomain = () => {
    setBlogData({ 
      ...blogData, 
      domainType: 'subdomain',
      subdomain: `blog-${Date.now()}`,
      domainAvailable: true 
    });
    setTimeout(handleComplete, 100);
  };

  // Handle subdomain input change
  const handleSubdomainChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setBlogData(prev => ({ ...prev, subdomain: value }));
    checkDomainAvailability(value);
  };

  // Handle custom domain input change
  const handleCustomDomainChange = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setBlogData(prev => ({ ...prev, customDomain: value }));
    checkDomainAvailability(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                  step >= num
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`flex-1 h-1 mx-4 transition-all ${
                    step > num ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 px-2">
            <span>Basic Info</span>
            <span>Category</span>
            <span>Domain</span>
          </div>
        </div>

        {/* Reward Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white text-center shadow-xl">
          <p className="font-bold">🎉 Earn 100 CYBEV Tokens for Creating Your Blog!</p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Tell us about your {blogData.isMinistry ? 'ministry' : 'blog'}
            </h2>
            <p className="text-gray-600 mb-8">
              This information will be displayed on your website
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="isMinistry"
                  checked={blogData.isMinistry}
                  onChange={(e) => setBlogData({ ...blogData, isMinistry: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isMinistry" className="text-sm font-medium text-gray-700">
                  This is a ministry or church website
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {blogData.isMinistry ? 'Ministry/Church Name' : 'Blog Name'} *
                </label>
                <input
                  type="text"
                  value={blogData.name}
                  onChange={(e) => setBlogData({ ...blogData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                  placeholder={blogData.isMinistry ? 'e.g., Grace Community Church' : 'e.g., My Tech Blog'}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={blogData.tagline}
                  onChange={(e) => setBlogData({ ...blogData, tagline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                  placeholder={blogData.isMinistry ? 'e.g., Sharing God\'s Love' : 'e.g., Insights on Tech & Innovation'}
                />
              </div>

              {blogData.isMinistry && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Denomination (Optional)
                    </label>
                    <input
                      type="text"
                      value={blogData.denomination}
                      onChange={(e) => setBlogData({ ...blogData, denomination: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                      placeholder="e.g., Baptist, Methodist, Non-denominational"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={blogData.location}
                      onChange={(e) => setBlogData({ ...blogData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                      placeholder="e.g., New York, NY"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-xl transition-all active:scale-95"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Category */}
        {step === 2 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Choose Your Category
            </h2>
            <p className="text-gray-600 mb-8">
              Select the primary category for your content
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setBlogData({ ...blogData, category: cat.id })}
                  className={`p-4 rounded-xl border-2 transition-all text-left active:scale-95 ${
                    blogData.category === cat.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{cat.label}</p>
                  <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                    cat.type === 'ministry'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    {cat.type === 'ministry' ? 'Ministry' : 'General'}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-xl transition-all active:scale-95"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Domain */}
        {step === 3 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Choose Your Domain
            </h2>
            <p className="text-gray-600 mb-8">
              Select a subdomain or connect your custom domain
            </p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setBlogData({ ...blogData, domainType: 'subdomain' })}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  blogData.domainType === 'subdomain'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <p className="font-bold text-gray-900">Free Subdomain</p>
                <p className="text-sm text-gray-600">yourname.cybev.io</p>
              </button>

              <button
                onClick={() => setBlogData({ ...blogData, domainType: 'custom' })}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  blogData.domainType === 'custom'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <p className="font-bold text-gray-900">Custom Domain</p>
                <p className="text-sm text-gray-600">yourdomain.com</p>
              </button>
            </div>

            {blogData.domainType === 'subdomain' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose your subdomain
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={blogData.subdomain}
                    onChange={handleSubdomainChange}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                    placeholder="myblog"
                    maxLength={63}
                  />
                  <span className="text-gray-600 font-medium">.cybev.io</span>
                </div>
                
                {blogData.subdomain.length >= 3 && (
                  <div className="mt-4">
                    {domainChecking ? (
                      <p className="text-gray-600">🔍 Checking availability...</p>
                    ) : domainAvailable === true ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-green-700 font-bold">✅ {blogData.subdomain}.cybev.io is available!</p>
                      </div>
                    ) : domainAvailable === false ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-700 font-bold">❌ This subdomain is taken. Try another one.</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter your custom domain
                </label>
                <input
                  type="text"
                  value={blogData.customDomain}
                  onChange={handleCustomDomainChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                  placeholder="yourdomain.com"
                  maxLength={253}
                />
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-700 font-semibold">💡 Custom Domain Setup</p>
                  <p className="text-sm text-gray-600 mt-2">
                    After creating your blog, you'll need to:
                  </p>
                  <ol className="text-sm text-gray-600 mt-2 ml-4 list-decimal">
                    <li>Point your domain's DNS to our servers</li>
                    <li>Verify domain ownership</li>
                    <li>SSL certificate will be automatically configured</li>
                  </ol>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
              >
                ← Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleSkipDomain}
                  disabled={loading}
                  className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Creating Blog...' : 'Complete Setup 🚀'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
