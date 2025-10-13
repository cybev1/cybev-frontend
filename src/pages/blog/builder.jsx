import React, { useState } from 'react';
import { useRouter } from 'next/router';

const BlogBuilder = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [blogData, setBlogData] = useState({
    topic: '',
    tone: 'professional',
    length: 'medium',
    keywords: []
  });

  const tones = [
    { id: 'professional', label: 'Professional', icon: '💼', desc: 'Formal and authoritative' },
    { id: 'casual', label: 'Casual', icon: '😊', desc: 'Friendly and conversational' },
    { id: 'educational', label: 'Educational', icon: '📚', desc: 'Informative and clear' },
    { id: 'creative', label: 'Creative', icon: '🎨', desc: 'Imaginative and engaging' }
  ];

  const lengths = [
    { id: 'short', label: 'Short', words: '500-800', time: '3-5 min read' },
    { id: 'medium', label: 'Medium', words: '800-1500', time: '5-8 min read' },
    { id: 'long', label: 'Long', words: '1500+', time: '8+ min read' }
  ];

  const handleNext = () => {
    if (step === 1 && !blogData.topic.trim()) {
      alert('Please enter a topic');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Navigate to voice recording with blog data
      router.push({
        pathname: '/studio/voice-record',
        query: { blogData: JSON.stringify(blogData) }
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold ${
                  step >= num
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step > num ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Topic</span>
            <span>Style</span>
            <span>Details</span>
          </div>
        </div>

        {/* Step 1: Topic */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              What's your blog post about?
            </h2>
            <p className="text-gray-600 mb-8">
              Describe your topic in a few words or a sentence
            </p>

            <textarea
              value={blogData.topic}
              onChange={(e) => setBlogData({ ...blogData, topic: e.target.value })}
              placeholder="e.g., 'The future of AI in healthcare' or 'My journey learning to code'"
              className="w-full h-40 px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none text-lg resize-none"
              autoFocus
            />

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-xl transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Tone & Length */}
        {step === 2 && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Choose your style
            </h2>
            <p className="text-gray-600 mb-8">
              Select the tone and length that fits your content
            </p>

            {/* Tone Selection */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Tone</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setBlogData({ ...blogData, tone: tone.id })}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      blogData.tone === tone.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{tone.icon}</div>
                    <div className="font-semibold text-gray-800">{tone.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{tone.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Length</h3>
              <div className="grid grid-cols-3 gap-4">
                {lengths.map((length) => (
                  <button
                    key={length.id}
                    onClick={() => setBlogData({ ...blogData, length: length.id })}
                    className={`p-6 rounded-xl border-2 transition-all text-center ${
                      blogData.length === length.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-bold text-lg text-gray-800 mb-1">{length.label}</div>
                    <div className="text-sm text-gray-600">{length.words} words</div>
                    <div className="text-xs text-gray-500 mt-1">{length.time}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-xl transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Keywords (Optional) */}
        {step === 3 && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Add keywords (optional)
            </h2>
            <p className="text-gray-600 mb-8">
              Help us optimize your content for SEO
            </p>

            <input
              type="text"
              placeholder="Press Enter to add keywords (e.g., AI, healthcare, innovation)"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none text-lg mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setBlogData({
                    ...blogData,
                    keywords: [...blogData.keywords, e.target.value.trim()]
                  });
                  e.target.value = '';
                }
              }}
            />

            {/* Keyword Tags */}
            {blogData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blogData.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      onClick={() => {
                        setBlogData({
                          ...blogData,
                          keywords: blogData.keywords.filter((_, i) => i !== idx)
                        });
                      }}
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-blue-800">
                💡 <strong>Next step:</strong> You'll record or type your content using voice or keyboard
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-xl transition-all"
              >
                Start Creating →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogBuilder;