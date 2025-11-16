import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Wand2,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Rocket,
  Hash,
  Image as ImageIcon,
  Eye,
  TrendingUp,
  Coins,
  FileText,
  Tag
} from 'lucide-react';

export default function AIBlogGenerator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    niche: 'technology',
    tone: 'professional',
    length: 'medium',
    targetAudience: 'general'
  });

  const niches = [
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'health', label: 'Health & Wellness', icon: '🏥' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '✨' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'food', label: 'Food & Cooking', icon: '🍳' }
  ];

  const tones = [
    { id: 'professional', label: 'Professional', desc: 'Formal and authoritative' },
    { id: 'casual', label: 'Casual', desc: 'Friendly and conversational' },
    { id: 'educational', label: 'Educational', desc: 'Informative and clear' },
    { id: 'creative', label: 'Creative', desc: 'Imaginative and engaging' }
  ];

  const lengths = [
    { id: 'short', label: 'Short', words: '800-1200', time: '4-6 min read' },
    { id: 'medium', label: 'Medium', words: '1200-2000', time: '6-10 min read' },
    { id: 'long', label: 'Long', words: '2000-3000', time: '10-15 min read' }
  ];

  const handleGenerate = async () => {
    if (!formData.topic) {
      alert('Please enter a topic!');
      return;
    }

    setGenerating(true);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      const response = await fetch(`${API_URL}/api/content/create-blog`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedBlog(data.data);
        setStep(3);
        
        // Show success message
        alert(`🎉 Blog created! You earned ${data.tokensEarned} tokens!\n\nVirality Score: ${data.viralityScore}/100`);
      } else {
        throw new Error(data.error || 'Failed to generate blog');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate blog: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = () => {
    // TODO: Save to database
    alert('Publishing feature coming soon!\n\nFor now, you can copy the content and publish manually in Blog Create page.');
    router.push('/blog/create');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              AI Blog Generator
            </h1>
            <p className="text-purple-200 text-lg">
              Create complete blog posts with SEO, images, and hashtags in seconds
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <motion.div
                  animate={{
                    scale: step >= num ? 1.2 : 1,
                    backgroundColor: step >= num ? '#A855F7' : '#374151'
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    step === num ? 'ring-4 ring-purple-500/30' : ''
                  }`}
                >
                  {step > num ? <Check className="w-6 h-6" /> : num}
                </motion.div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > num ? 'bg-purple-500' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Topic & Niche */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-3">What's your blog about?</h2>
                  <p className="text-purple-200 mb-8">Tell us your topic and choose a niche</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Blog Topic *
                      </label>
                      <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        placeholder="e.g., The Future of AI in Content Creation"
                        className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-purple-300 focus:border-purple-500 focus:outline-none"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-3">Choose Niche</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {niches.map((niche) => (
                          <motion.button
                            key={niche.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, niche: niche.id })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.niche === niche.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-white/20 bg-white/5 hover:border-purple-500/50'
                            }`}
                          >
                            <div className="text-3xl mb-2">{niche.icon}</div>
                            <div className="text-white text-sm font-semibold">{niche.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Tone & Length */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-3">Choose your style</h2>
                  <p className="text-purple-200 mb-8">Select tone and length</p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-white font-semibold mb-4">Tone</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {tones.map((tone) => (
                          <motion.button
                            key={tone.id}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setFormData({ ...formData, tone: tone.id })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.tone === tone.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-white/20 bg-white/5'
                            }`}
                          >
                            <div className="text-white font-bold mb-1">{tone.label}</div>
                            <div className="text-purple-200 text-xs">{tone.desc}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-4">Length</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {lengths.map((length) => (
                          <motion.button
                            key={length.id}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setFormData({ ...formData, length: length.id })}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              formData.length === length.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-white/20 bg-white/5'
                            }`}
                          >
                            <div className="text-white font-bold text-lg mb-1">{length.label}</div>
                            <div className="text-purple-200 text-sm">{length.words}</div>
                            <div className="text-purple-300 text-xs mt-1">{length.time}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Generated Result */}
              {step === 3 && generatedBlog && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full mb-4"
                    >
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-semibold">Blog Created Successfully!</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">{generatedBlog.title}</h2>
                    <p className="text-purple-200">{generatedBlog.summary}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <Eye className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-white font-bold">{generatedBlog.readTime}</p>
                      <p className="text-purple-200 text-xs">Read Time</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
                      <p className="text-white font-bold">{generatedBlog.viralityScore}/100</p>
                      <p className="text-purple-200 text-xs">Virality</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <Coins className="w-5 h-5 text-yellow-400 mb-2" />
                      <p className="text-white font-bold">{generatedBlog.initialTokens}</p>
                      <p className="text-purple-200 text-xs">Tokens Earned</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <Hash className="w-5 h-5 text-pink-400 mb-2" />
                      <p className="text-white font-bold">
                        {Object.values(generatedBlog.hashtags || {}).flat().length}
                      </p>
                      <p className="text-purple-200 text-xs">Hashtags</p>
                    </div>
                  </div>

                  {/* SEO Preview */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      SEO Optimization
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-purple-300 text-sm mb-1">SEO Title</p>
                        <p className="text-white">{generatedBlog.seo?.title}</p>
                      </div>
                      <div>
                        <p className="text-purple-300 text-sm mb-1">Description</p>
                        <p className="text-white text-sm">{generatedBlog.seo?.description}</p>
                      </div>
                      <div>
                        <p className="text-purple-300 text-sm mb-1">URL Slug</p>
                        <p className="text-blue-400 font-mono text-sm">{generatedBlog.seo?.slug}</p>
                      </div>
                      <div>
                        <p className="text-purple-300 text-sm mb-1">Keywords</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {generatedBlog.seo?.keywords?.slice(0, 8).map((keyword, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Image */}
                  {generatedBlog.featuredImage && (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-cyan-400" />
                        Featured Image
                      </h3>
                      <img
                        src={generatedBlog.featuredImage.url}
                        alt={generatedBlog.featuredImage.alt}
                        className="w-full h-64 object-cover rounded-xl mb-3"
                      />
                      <p className="text-purple-200 text-sm">
                        Photo by {generatedBlog.featuredImage.credit?.photographer}
                      </p>
                    </div>
                  )}

                  {/* Hashtags */}
                  {generatedBlog.hashtags && (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-pink-400" />
                        Viral Hashtags
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(generatedBlog.hashtags).map(([category, tags]) => (
                          <div key={category}>
                            <p className="text-purple-300 text-sm mb-2 capitalize">{category}</p>
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-h-96 overflow-y-auto">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-400" />
                      Content Preview
                    </h3>
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: generatedBlog.content?.substring(0, 1000) + '...' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              {step > 1 && step < 3 && (
                <motion.button
                  whileHover={{ scale: 1.05, x: -5 }}
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
              )}

              {step < 2 && (
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  onClick={() => setStep(2)}
                  disabled={!formData.topic}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold ml-auto disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}

              {step === 2 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg ml-auto disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Generate Blog
                    </>
                  )}
                </motion.button>
              )}

              {step === 3 && (
                <div className="flex gap-3 ml-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setStep(1);
                      setGeneratedBlog(null);
                    }}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold"
                  >
                    Create Another
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold"
                  >
                    <Rocket className="w-5 h-5" />
                    Publish Blog
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Generating Modal */}
          <AnimatePresence>
            {generating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30 text-center max-w-md"
                >
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">Creating Your Blog...</h3>
                  <p className="text-purple-200 mb-6">AI is generating SEO-optimized content with images and hashtags</p>
                  
                  <div className="space-y-3">
                    {['Analyzing topic', 'Generating content', 'Optimizing SEO', 'Finding images', 'Creating hashtags'].map((text, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.5 }}
                        className="flex items-center gap-3 text-white"
                      >
                        <Check className="w-5 h-5 text-green-400" />
                        {text}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}