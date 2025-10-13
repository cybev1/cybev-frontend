import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Onboarding = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedType) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Update user preferences
      await axios.post(
        'http://localhost:5000/api/auth/onboarding',
        { contentType: selectedType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Navigate based on selection
      if (selectedType === 'blog') {
        router.push('/blog/builder');
      } else if (selectedType === 'social') {
        router.push('/studio/social');
      } else {
        router.push('/studio');
      }
    } catch (err) {
      console.error('Onboarding error:', err);
      // Continue anyway
      router.push('/studio');
    } finally {
      setLoading(false);
    }
  };

  const options = [
    {
      id: 'blog',
      icon: '📝',
      title: 'Blog Posts',
      description: 'Create long-form articles with AI-powered writing assistance',
      features: ['SEO optimization', 'Rich formatting', 'Auto-save drafts']
    },
    {
      id: 'social',
      icon: '📱',
      title: 'Social Media',
      description: 'Quick posts optimized for Twitter, LinkedIn, and Instagram',
      features: ['Platform-specific', 'Trending topics', 'Schedule posts']
    },
    {
      id: 'both',
      icon: '✨',
      title: 'Both',
      description: 'Get the full suite of content creation tools',
      features: ['All features', 'Cross-posting', 'Unified analytics'],
      recommended: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            What would you like to create?
          </h1>
          <p className="text-xl text-gray-600">
            Choose your primary focus. You can always change this later.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedType(option.id)}
              className={`relative p-8 rounded-3xl border-2 transition-all text-left ${
                selectedType === option.id
                  ? 'border-purple-500 bg-purple-50 shadow-xl scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg'
              }`}
            >
              {/* Recommended Badge */}
              {option.recommended && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Recommended
                </div>
              )}

              {/* Icon */}
              <div className="text-5xl mb-4">{option.icon}</div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-2 text-gray-800">
                {option.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4">
                {option.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {option.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Selected Indicator */}
              {selectedType === option.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedType || loading}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Setting up...' : 'Continue'}
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/studio')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;