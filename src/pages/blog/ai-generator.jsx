// 🎨 ULTRA-MODERN AI TEMPLATE GENERATOR
// Squarespace-inspired design with stunning visuals and smooth animations
// Fully mobile-responsive for web, iOS, and Android
// File path: pages/blog/ai-generator.jsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ChevronRight, Check, Wand2, Palette, 
  Layout, Zap, ArrowLeft, Eye, Download 
} from 'lucide-react';

export default function AITemplateGenerator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [userInput, setUserInput] = useState({
    industry: '',
    style: '',
    colorScheme: '',
    features: []
  });

  // 🎨 Industries with beautiful Unsplash images
  const industries = [
    {
      id: 'tech',
      name: 'Tech & SaaS',
      icon: '💻',
      description: 'Modern platforms for software, apps, and digital products',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      gradient: 'from-blue-600 to-cyan-500',
      color: '#3B82F6'
    },
    {
      id: 'ministry',
      name: 'Ministry & Church',
      icon: '⛪',
      description: 'Welcoming designs for churches and faith communities',
      image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
      gradient: 'from-purple-600 to-pink-500',
      color: '#9333EA'
    },
    {
      id: 'news',
      name: 'News & Media',
      icon: '📰',
      description: 'Professional layouts for journalism and publications',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
      gradient: 'from-gray-800 to-gray-600',
      color: '#1F2937'
    },
    {
      id: 'business',
      name: 'Business & Corporate',
      icon: '💼',
      description: 'Elegant solutions for B2B and enterprise',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      gradient: 'from-indigo-600 to-blue-600',
      color: '#4F46E5'
    },
    {
      id: 'creative',
      name: 'Creative Portfolio',
      icon: '🎨',
      description: 'Stunning showcases for artists and designers',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
      gradient: 'from-pink-600 to-purple-600',
      color: '#DB2777'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      icon: '🛍️',
      description: 'Beautiful stores that convert browsers to buyers',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      gradient: 'from-green-600 to-emerald-500',
      color: '#059669'
    },
    {
      id: 'education',
      name: 'Education & Learning',
      icon: '📚',
      description: 'Engaging platforms for courses and knowledge sharing',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      gradient: 'from-orange-600 to-yellow-500',
      color: '#EA580C'
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: '💪',
      description: 'Clean designs for fitness and wellbeing brands',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
      gradient: 'from-teal-600 to-cyan-500',
      color: '#0D9488'
    },
    {
      id: 'food',
      name: 'Food & Restaurant',
      icon: '🍽️',
      description: 'Appetizing layouts for culinary businesses',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      gradient: 'from-red-600 to-orange-500',
      color: '#DC2626'
    },
    {
      id: 'realestate',
      name: 'Real Estate',
      icon: '🏠',
      description: 'Professional sites for property and listings',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
      gradient: 'from-slate-700 to-gray-600',
      color: '#334155'
    }
  ];

  // 🎭 Styles with visual previews
  const styles = [
    {
      id: 'modern',
      name: 'Modern & Minimal',
      description: 'Clean lines, spacious layouts, timeless elegance',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      features: ['Ample whitespace', 'Simple typography', 'Subtle animations'],
      color: '#6366F1'
    },
    {
      id: 'bold',
      name: 'Bold & Vibrant',
      description: 'Eye-catching colors, dynamic layouts, high energy',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
      features: ['Bright colors', 'Large typography', 'Strong contrast'],
      color: '#F59E0B'
    },
    {
      id: 'professional',
      name: 'Professional & Corporate',
      description: 'Trustworthy, refined, business-appropriate',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
      features: ['Conservative palette', 'Structured layout', 'Formal tone'],
      color: '#1E40AF'
    },
    {
      id: 'creative',
      name: 'Creative & Artistic',
      description: 'Unique, expressive, boundary-pushing design',
      image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3',
      features: ['Asymmetric layouts', 'Custom elements', 'Artistic flair'],
      color: '#EC4899'
    },
    {
      id: 'dark',
      name: 'Dark & Sleek',
      description: 'Sophisticated, modern, premium aesthetic',
      image: 'https://images.unsplash.com/photo-1557683316-973673baf926',
      features: ['Dark backgrounds', 'Neon accents', 'Premium feel'],
      color: '#0F172A'
    }
  ];

  // 🌈 Color schemes with beautiful palettes
  const colorSchemes = [
    {
      id: 'ocean',
      name: 'Ocean Blue',
      colors: ['#1E40AF', '#3B82F6', '#60A5FA', '#DBEAFE'],
      description: 'Calm, trustworthy, professional'
    },
    {
      id: 'forest',
      name: 'Forest Green',
      colors: ['#065F46', '#059669', '#10B981', '#D1FAE5'],
      description: 'Natural, growth-focused, sustainable'
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      colors: ['#C2410C', '#EA580C', '#F97316', '#FFEDD5'],
      description: 'Warm, energetic, inviting'
    },
    {
      id: 'royal',
      name: 'Royal Purple',
      colors: ['#6B21A8', '#9333EA', '#A855F7', '#F3E8FF'],
      description: 'Luxurious, creative, innovative'
    },
    {
      id: 'midnight',
      name: 'Midnight Dark',
      colors: ['#0F172A', '#1E293B', '#334155', '#CBD5E1'],
      description: 'Sophisticated, modern, premium'
    },
    {
      id: 'rose',
      name: 'Rose Pink',
      colors: ['#BE123C', '#E11D48', '#F43F5E', '#FFE4E6'],
      description: 'Romantic, elegant, memorable'
    }
  ];

  // ✨ Features
  const features = [
    'Blog System', 'Contact Form', 'Newsletter Signup',
    'Social Media Links', 'Image Gallery', 'Video Embed',
    'Testimonials', 'FAQ Section', 'Team Page',
    'Pricing Tables', 'Search Bar', 'Live Chat'
  ];

  const handleNext = () => {
    if (step === 1 && !userInput.industry) {
      alert('Please select an industry');
      return;
    }
    if (step === 2 && !userInput.style) {
      alert('Please select a style');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleGenerate();
    }
  };

  const handleGenerate = () => {
    setGenerating(true);
    setStep(4);
    
    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false);
    }, 3000);
  };

  const toggleFeature = (feature) => {
    setUserInput(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* ✨ Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">AI Template Generator</h1>
                <p className="text-xs text-gray-500">Powered by CYBEV.io</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Step {step} of 3
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
          />
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {/* 🎯 STEP 1: Industry Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8 md:mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-block mb-4"
                >
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-purple-600" />
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  What's your website about?
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose your industry and our AI will generate a perfect design
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {industries.map((industry, index) => (
                  <motion.div
                    key={industry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserInput({ ...userInput, industry: industry.id })}
                    className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                      userInput.industry === industry.id
                        ? 'ring-4 ring-purple-500 shadow-2xl shadow-purple-200'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    {/* Image Background */}
                    <div className="relative h-40 md:h-48 overflow-hidden">
                      <Image
                        src={`${industry.image}?w=600&h=400&fit=crop`}
                        alt={industry.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${industry.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                      
                      {/* Icon */}
                      <div className="absolute top-4 left-4 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl md:text-3xl border border-white/30">
                        {industry.icon}
                      </div>

                      {/* Selected Badge */}
                      {userInput.industry === industry.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                        >
                          <Check className="w-5 h-5 text-purple-600" />
                        </motion.div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-5 bg-white">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                        {industry.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {industry.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Continue Button */}
              {userInput.industry && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl z-40"
                >
                  <div className="max-w-7xl mx-auto flex justify-end">
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 🎨 STEP 2: Style Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8 md:mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-block mb-4"
                >
                  <Palette className="w-12 h-12 md:w-16 md:h-16 text-purple-600" />
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  Choose your style
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Select the aesthetic that represents your brand
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-20">
                {styles.map((style, index) => (
                  <motion.div
                    key={style.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserInput({ ...userInput, style: style.id })}
                    className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                      userInput.style === style.id
                        ? 'ring-4 ring-purple-500 shadow-2xl shadow-purple-200'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-56 md:h-64 overflow-hidden">
                      <Image
                        src={`${style.image}?w=800&h=600&fit=crop`}
                        alt={style.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Selected Badge */}
                      {userInput.style === style.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg"
                        >
                          <Check className="w-6 h-6 text-purple-600" />
                        </motion.div>
                      )}

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                          {style.name}
                        </h3>
                        <p className="text-sm text-white/90 mb-4">
                          {style.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {style.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium border border-white/30"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl z-40"
              >
                <div className="max-w-7xl mx-auto flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  {userInput.style && (
                    <button
                      onClick={handleNext}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 🌈 STEP 3: Customization */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="pb-32"
            >
              <div className="text-center mb-8 md:mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-block mb-4"
                >
                  <Layout className="w-12 h-12 md:w-16 md:h-16 text-purple-600" />
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  Customize your site
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose colors and features that make it yours
                </p>
              </div>

              {/* Color Schemes */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Color Scheme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {colorSchemes.map((scheme, index) => (
                    <motion.div
                      key={scheme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUserInput({ ...userInput, colorScheme: scheme.id })}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        userInput.colorScheme === scheme.id
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex gap-2 mb-4">
                        {scheme.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-lg shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {scheme.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {scheme.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Features (Select all that apply)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {features.map((feature, index) => (
                    <motion.button
                      key={feature}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFeature(feature)}
                      className={`p-4 rounded-xl font-semibold text-sm transition-all ${
                        userInput.features.includes(feature)
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      {userInput.features.includes(feature) && (
                        <Check className="w-4 h-4 inline mr-1" />
                      )}
                      {feature}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl z-40"
              >
                <div className="max-w-7xl mx-auto flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  {userInput.colorScheme && (
                    <button
                      onClick={handleNext}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Generate My Site
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ⚡ STEP 4: Generation & Result */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[80vh] flex items-center justify-center"
            >
              {generating ? (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="inline-block mb-6"
                  >
                    <Wand2 className="w-20 h-20 md:w-24 md:h-24 text-purple-600" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    AI is crafting your website...
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    This usually takes 10-15 seconds
                  </p>
                  <div className="max-w-md mx-auto space-y-3">
                    {[
                      'Analyzing your requirements...',
                      'Generating layout structure...',
                      'Creating demo content...',
                      'Applying your color scheme...'
                    ].map((text, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.5 }}
                        className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700">{text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center max-w-2xl mx-auto"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="inline-block mb-6"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    🎉 Your site is ready!
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    We've created a unique design just for you
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/blog/preview')}
                      className="px-8 py-4 bg-white border-2 border-gray-300 hover:border-purple-500 text-gray-900 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      Preview Site
                    </button>
                    <button
                      onClick={() => router.push('/blog/setup')}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Deploy Now
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
