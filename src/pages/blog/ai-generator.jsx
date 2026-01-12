import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Wand2,
  Sparkles,
  Brain,
  Zap,
  Globe,
  Palette,
  Code,
  Layout,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Rocket,
  Crown,
  Star
} from 'lucide-react';

export default function AIGenerator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    websiteType: '',
    businessName: '',
    description: '',
    style: 'modern',
    colors: 'vibrant',
    aiModel: 'deepseek'
  });

  const websiteTypes = [
    { id: 'blog', label: 'Blog/Magazine', icon: '📰', desc: 'News, articles & stories' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼', desc: 'Showcase your work' },
    { id: 'business', label: 'Business', icon: '🏢', desc: 'Company website' },
    { id: 'ecommerce', label: 'E-commerce', icon: '🛍️', desc: 'Online store' },
    { id: 'landing', label: 'Landing Page', icon: '🚀', desc: 'Product launch' },
    { id: 'saas', label: 'SaaS', icon: '💻', desc: 'Software platform' },
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️', desc: 'Menu & reservations' },
    { id: 'education', label: 'Education', icon: '📚', desc: 'Courses & learning' }
  ];

  const styles = [
    { id: 'modern', label: 'Modern', preview: 'Clean lines, minimalist' },
    { id: 'classic', label: 'Classic', preview: 'Traditional, elegant' },
    { id: 'bold', label: 'Bold', preview: 'Eye-catching, dynamic' },
    { id: 'minimal', label: 'Minimal', preview: 'Simple, focused' }
  ];

  const colorSchemes = [
    { id: 'vibrant', label: 'Vibrant', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'] },
    { id: 'professional', label: 'Professional', colors: ['#2C3E50', '#3498DB', '#ECF0F1'] },
    { id: 'warm', label: 'Warm', colors: ['#E74C3C', '#F39C12', '#F1C40F'] },
    { id: 'cool', label: 'Cool', colors: ['#3498DB', '#9B59B6', '#1ABC9C'] },
    { id: 'monochrome', label: 'Monochrome', colors: ['#2C3E50', '#95A5A6', '#ECF0F1'] }
  ];

  const aiModels = [
    {
      id: 'deepseek',
      name: 'DeepSeek',
      description: 'Lightning-fast & cost-effective',
      icon: Zap,
      badge: 'Recommended',
      color: 'yellow'
    },
    {
      id: 'claude',
      name: 'Claude',
      description: 'Best for creative & detailed content',
      icon: Brain,
      badge: 'Best Quality',
      color: 'purple'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT-4',
      description: 'Most versatile & powerful',
      icon: Sparkles,
      badge: 'Most Popular',
      color: 'green'
    }
  ];

  const handleGenerate = async () => {
    if (!formData.websiteType || !formData.businessName || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false);
      router.push({
        pathname: '/studio/builder',
        query: {
          generated: 'true',
          type: formData.websiteType,
          name: formData.businessName,
          style: formData.style,
          colors: formData.colors,
          ai: formData.aiModel
        }
      });
    }, 5000);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="flex items-center">
          <motion.div
            animate={{
              scale: step >= num ? 1.2 : 1,
              backgroundColor: step >= num ? '#A855F7' : '#374151'
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-gray-900 transition-all ${
              step === num ? 'ring-4 ring-purple-500/30' : ''
            }`}
          >
            {step > num ? <Check className="w-6 h-6" /> : num}
          </motion.div>
          {num < 4 && (
            <div className={`w-16 h-1 mx-2 transition-all ${
              step > num ? 'bg-purple-500' : 'bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 0, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Wand2 className="w-10 h-10 text-gray-900" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              AI Website Generator
            </h1>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Generate complete, professional websites in seconds with AI
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              <div className="flex items-center gap-2 bg-purple-500/20 border border-gray-200 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-900 text-sm font-semibold">Powered by DeepSeek</span>
              </div>
              <div className="flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 px-4 py-2 rounded-full">
                <Brain className="w-4 h-4 text-pink-600" />
                <span className="text-gray-900 text-sm font-semibold">& Claude AI</span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-gray-900 text-sm font-semibold">& OpenAI GPT-4</span>
              </div>
            </div>
          </motion.div>

          {/* Progress */}
          <StepIndicator />

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Website Type */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">What type of website?</h2>
                  <p className="text-purple-200 mb-8">Choose the type that best fits your needs</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {websiteTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, websiteType: type.id })}
                        className={`p-6 rounded-2xl border-2 transition-all text-center ${
                          formData.websiteType === type.id
                            ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/15'
                            : 'border-gray-200 bg-white/5 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="text-4xl mb-3">{type.icon}</div>
                        <div className="text-gray-900 font-bold mb-1">{type.label}</div>
                        <div className="text-purple-200 text-xs">{type.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Business Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Tell us about your project</h2>
                  <p className="text-purple-200 mb-8">Help AI understand what you're building</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Business/Project Name *
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g., TechStartup Inc."
                        className="w-full px-6 py-4 bg-white/10 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-purple-300 focus:border-purple-500 focus:outline-none transition-all"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe what your website is about, what it offers, and who it's for..."
                        className="w-full h-32 px-6 py-4 bg-white/10 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-purple-300 focus:border-purple-500 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <p className="text-blue-200 text-sm">
                        💡 <strong>Pro tip:</strong> Be specific! The more details you provide, the better AI can tailor your website.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Style & Colors */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose your style</h2>
                  <p className="text-purple-200 mb-8">Select design style and color scheme</p>

                  <div className="space-y-8">
                    {/* Style */}
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-4">Design Style</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {styles.map((style) => (
                          <motion.button
                            key={style.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, style: style.id })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.style === style.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-gray-200 bg-white/5 hover:border-purple-500/50'
                            }`}
                          >
                            <div className="text-gray-900 font-bold mb-1">{style.label}</div>
                            <div className="text-purple-200 text-xs">{style.preview}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-4">Color Scheme</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {colorSchemes.map((scheme) => (
                          <motion.button
                            key={scheme.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, colors: scheme.id })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.colors === scheme.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-gray-200 bg-white/5 hover:border-purple-500/50'
                            }`}
                          >
                            <div className="flex gap-2 mb-2">
                              {scheme.colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-8 h-8 rounded-lg"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div className="text-gray-900 font-semibold">{scheme.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: AI Model Selection */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose your AI model</h2>
                  <p className="text-purple-200 mb-8">Each model has unique strengths</p>

                  <div className="space-y-4">
                    {aiModels.map((model) => (
                      <motion.button
                        key={model.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, aiModel: model.id })}
                        className={`w-full p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                          formData.aiModel === model.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-200 bg-white/5 hover:border-purple-500/50'
                        }`}
                      >
                        {model.badge && (
                          <div className={`absolute top-4 right-4 bg-${model.color}-500 text-${model.color}-900 text-xs font-bold px-3 py-1 rounded-full`}>
                            {model.badge}
                          </div>
                        )}
                        
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-${model.color}-500/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <model.icon className={`w-6 h-6 text-${model.color}-400`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{model.name}</h3>
                            <p className="text-purple-200">{model.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <Crown className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                      <div>
                        <h4 className="text-gray-900 font-bold mb-2">Earn 100 Coins!</h4>
                        <p className="text-green-200 text-sm">
                          Generate your website and earn rewards. Plus, earn more for every view and interaction!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-gray-900 rounded-xl font-semibold transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
              )}

              {step < 4 ? (
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !formData.websiteType) ||
                    (step === 2 && (!formData.businessName || !formData.description))
                  }
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-900 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-900 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto shadow-2xl"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Generate Website
                    </>
                  )}
                </motion.button>
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
                className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-gray-200 text-center max-w-md"
                >
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-10 h-10 text-gray-900" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Creating Your Website...</h3>
                  <p className="text-purple-200 mb-6">AI is generating your professional website with custom design, content, and layout</p>
                  
                  <div className="space-y-3">
                    {['Analyzing requirements', 'Generating design', 'Creating content', 'Finalizing layout'].map((text, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.5 }}
                        className="flex items-center gap-3 text-gray-900"
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
