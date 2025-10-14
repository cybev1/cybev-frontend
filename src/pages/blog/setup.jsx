import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function BlogSetup() {
  const router = useRouter();
  const { template } = router.query;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [domainChecking, setDomainChecking] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState(null);
  
  const [blogData, setBlogData] = useState({
    name: '',
    tagline: '',
    category: '',
    isMinistry: false,
    // Ministry specific
    churchName: '',
    denomination: '',
    location: '',
    // Domain
    domainType: 'subdomain', // subdomain or custom
    subdomain: '',
    customDomain: '',
    domainAvailable: false
  });

  const categories = [
    // Ministry Categories
    { id: 'christianity', label: '✝️ Christianity', type: 'ministry' },
    { id: 'theology', label: '📖 Theology', type: 'ministry' },
    { id: 'missions', label: '🌍 Missions', type: 'ministry' },
    { id: 'prayer', label: '🙏 Prayer & Worship', type: 'ministry' },
    { id: 'bible-study', label: '📚 Bible Study', type: 'ministry' },
    { id: 'youth-ministry', label: '👥 Youth Ministry', type: 'ministry' },
    { id: 'church-leadership', label: '⛪ Church Leadership', type: 'ministry' },
    
    // General Categories
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

  const checkDomainAvailability = async (domain) => {
    if (!domain || domain.length < 3) {
      setDomainAvailable(null);
      return;
    }

    setDomainChecking(true);
    
    try {
      // DomainNameAPI check
      const response = await axios.post('/api/domains/check', {
        domain: blogData.domainType === 'subdomain' ? `${domain}.cybev.io` : domain
      });
      
      setDomainAvailable(response.data.available);
      setBlogData({ ...blogData, domainAvailable: response.data.available });
    } catch (err) {
      console.error('Domain check error:', err);
      setDomainAvailable(false);
    } finally {
      setDomainChecking(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !blogData.name) {
      alert('Please enter a blog name');
      return;
    }
    if (step === 2 && !blogData.category) {
      alert('Please select a category');
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Create blog
      const response = await axios.post(
        `${API_URL}/api/blogs/create`,
        { ...blogData, template },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Award CYBEV tokens for creating blog
      try {
        await axios.post(
          `${API_URL}/api/rewards/award`,
          { action: 'blog_created', amount: 100 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.log('Token reward pending');
      }

      router.push(`/blog/editor?id=${response.data.blogId}`);
    } catch (err) {
      console.error('Blog creation error:', err);
      alert('Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
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
                  placeholder={blogData.isMinistry ? 'e.g., Spreading the Gospel in Our Community' : 'e.g., Exploring the Future of Technology'}
                />
              </div>

              {/* Ministry Toggle */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogData.isMinistry}
                    onChange={(e) => setBlogData({ ...blogData, isMinistry: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">This is a ministry/church website</p>
                    <p className="text-sm text-gray-600">Get access to ministry-specific features</p>
                  </div>
                </label>
              </div>

              {/* Ministry Fields */}
              {blogData.isMinistry && (
                <div className="space-y-4 p-6 bg-purple-50 rounded-2xl border border-purple-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Denomination (Optional)
                    </label>
                    <input
                      type="text"
                      value={blogData.denomination}
                      onChange={(e) => setBlogData({ ...blogData, denomination: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition"
                      placeholder="e.g., Baptist, Methodist, Non-denominational"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={blogData.location}
                      onChange={(e) => setBlogData({ ...blogData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition"
                      placeholder="e.g., Chicago, IL"
                    />
                  </div>
                </div>
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

            {/* Domain Type Toggle */}
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

            {/* Domain Input */}
            {blogData.domainType === 'subdomain' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose your subdomain
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={blogData.subdomain}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setBlogData({ ...blogData, subdomain: value });
                      checkDomainAvailability(value);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                    placeholder="mychurch"
                  />
                  <span className="text-gray-600 font-medium">.cybev.io</span>
                </div>
                
                {/* Availability Status */}
                {blogData.subdomain.length >= 3 && (
                  <div className="mt-4">
                    {domainChecking ? (
                      <p className="text-gray-600">🔍 Checking availability...</p>
                    ) : domainAvailable === true ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-green-700 font-bold">🎉 Congratulations! {blogData.subdomain}.cybev.io is available!</p>
                      </div>
                    ) : domainAvailable === false ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-700 font-bold">❌ Sorry, this subdomain is taken. Try another one.</p>
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
                  onChange={(e) => {
                    setBlogData({ ...blogData, customDomain: e.target.value });
                    checkDomainAvailability(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                  placeholder="yourdomain.com"
                />
                
                {/* Availability Status */}
                {blogData.customDomain.length >= 5 && (
                  <div className="mt-4">
                    {domainChecking ? (
                      <p className="text-gray-600">🔍 Checking availability...</p>
                    ) : domainAvailable === true ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-green-700 font-bold">🎉 {blogData.customDomain} is available for purchase!</p>
                        <p className="text-sm text-gray-600 mt-2">Cost: 20 CYBEV tokens/year</p>
                      </div>
                    ) : domainAvailable === false ? (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-yellow-700 font-bold">This domain is already registered. You can connect it if you own it.</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading || (blogData.subdomain.length >= 3 && !domainAvailable)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Creating Blog...' : 'Complete Setup 🚀'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}