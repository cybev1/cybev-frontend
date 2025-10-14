import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Onboarding() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleContinue = async () => {
    if (!selectedType) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      console.log('📤 Sending onboarding to:', `${API_URL}/auth/onboarding`);
      
      await axios.post(
        `${API_URL}/auth/onboarding`,
        { contentType: selectedType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Onboarding completed');

      if (selectedType === 'blog') {
        router.push('/blog/builder');
      } else if (selectedType === 'social') {
        router.push('/studio/social');
      } else {
        router.push('/studio');
      }
    } catch (err) {
      console.error('❌ Onboarding error:', err.response?.data || err.message);
      router.push('/studio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-3xl font-bold text-white">C</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What brings you to <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">CYBEV</span>?
          </h1>
          <p className="text-lg text-gray-600">Choose how you want to get started (you can do both later!)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Blog Builder Option */}
          <button
            onClick={() => setSelectedType('blog')}
            className={`p-8 rounded-3xl bg-white border-4 transition-all duration-300 text-left group hover:shadow-2xl active:scale-95 ${
              selectedType === 'blog' 
                ? 'border-blue-500 shadow-2xl shadow-blue-200' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
              🎨
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Build a Blog/Website</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Create your own professional blog or website in minutes. Choose templates, customize design, and start publishing.
            </p>
            <div className="flex flex-wrap gap-2">
              {['AI Tools', 'Custom Domain', 'SEO Ready', 'Monetize'].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </button>

          {/* Social Feed Option */}
          <button
            onClick={() => setSelectedType('social')}
            className={`p-8 rounded-3xl bg-white border-4 transition-all duration-300 text-left group hover:shadow-2xl active:scale-95 ${
              selectedType === 'social' 
                ? 'border-cyan-500 shadow-2xl shadow-cyan-200' 
                : 'border-gray-200 hover:border-cyan-300'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Jump into Social Feed</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Start posting, connecting with creators, and earning crypto. Join communities, mint NFTs, and build your following.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Earn Crypto', 'Mint NFTs', 'Communities', 'Web3'].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-cyan-50 text-cyan-700 text-sm rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        </div>

        {selectedType && (
          <div className="mt-8 text-center">
            <button
              onClick={handleContinue}
              disabled={loading}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-lg shadow-2xl transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Setting up...' : `Continue to ${selectedType === 'blog' ? 'Blog Builder' : 'Social Feed'} →`}
            </button>
            <p className="mt-4 text-sm text-gray-600">
              You can always switch between blog and social features anytime!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
