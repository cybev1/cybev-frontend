// ============================================
// FILE: src/pages/studio/sites/new.jsx
// AI Website Builder - Multi-step wizard
// VERSION: 6.4.2
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Globe, ArrowLeft, ArrowRight, Check, Loader2, Sparkles,
  Layout, Palette, Type, Image as ImageIcon, Settings,
  Eye, Save, ChevronRight, AlertCircle, CheckCircle,
  Briefcase, ShoppingBag, Users, BookOpen, Camera, Music,
  Heart, Code, Rocket, Coffee, Zap, Star
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Site templates
const TEMPLATES = [
  {
    id: 'business',
    name: 'Business',
    icon: Briefcase,
    description: 'Professional business website',
    color: 'from-blue-500 to-indigo-600',
    preview: '/templates/business.png'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    icon: Camera,
    description: 'Showcase your work beautifully',
    color: 'from-purple-500 to-pink-500',
    preview: '/templates/portfolio.png'
  },
  {
    id: 'blog',
    name: 'Blog',
    icon: BookOpen,
    description: 'Share your stories and ideas',
    color: 'from-green-500 to-emerald-500',
    preview: '/templates/blog.png'
  },
  {
    id: 'shop',
    name: 'E-Commerce',
    icon: ShoppingBag,
    description: 'Sell products online',
    color: 'from-orange-500 to-red-500',
    preview: '/templates/shop.png'
  },
  {
    id: 'community',
    name: 'Community',
    icon: Users,
    description: 'Build your community',
    color: 'from-cyan-500 to-blue-500',
    preview: '/templates/community.png'
  },
  {
    id: 'landing',
    name: 'Landing Page',
    icon: Rocket,
    description: 'High-converting landing page',
    color: 'from-violet-500 to-purple-600',
    preview: '/templates/landing.png'
  },
  {
    id: 'music',
    name: 'Music/Artist',
    icon: Music,
    description: 'For musicians and artists',
    color: 'from-pink-500 to-rose-500',
    preview: '/templates/music.png'
  },
  {
    id: 'startup',
    name: 'Startup',
    icon: Zap,
    description: 'Modern startup website',
    color: 'from-amber-500 to-orange-500',
    preview: '/templates/startup.png'
  }
];

// Color themes
const COLOR_THEMES = [
  { id: 'purple', name: 'Purple', primary: '#8B5CF6', secondary: '#A78BFA' },
  { id: 'blue', name: 'Blue', primary: '#3B82F6', secondary: '#60A5FA' },
  { id: 'green', name: 'Green', primary: '#10B981', secondary: '#34D399' },
  { id: 'red', name: 'Red', primary: '#EF4444', secondary: '#F87171' },
  { id: 'orange', name: 'Orange', primary: '#F97316', secondary: '#FB923C' },
  { id: 'pink', name: 'Pink', primary: '#EC4899', secondary: '#F472B6' },
  { id: 'teal', name: 'Teal', primary: '#14B8A6', secondary: '#2DD4BF' },
  { id: 'indigo', name: 'Indigo', primary: '#6366F1', secondary: '#818CF8' }
];

// Font pairs
const FONT_PAIRS = [
  { id: 'modern', name: 'Modern', heading: 'Inter', body: 'Inter' },
  { id: 'classic', name: 'Classic', heading: 'Playfair Display', body: 'Lora' },
  { id: 'minimal', name: 'Minimal', heading: 'DM Sans', body: 'DM Sans' },
  { id: 'bold', name: 'Bold', heading: 'Poppins', body: 'Open Sans' },
  { id: 'elegant', name: 'Elegant', heading: 'Cormorant Garamond', body: 'Proza Libre' },
  { id: 'tech', name: 'Tech', heading: 'Space Grotesk', body: 'IBM Plex Sans' }
];

export default function NewSite() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  
  // Form data
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [colorTheme, setColorTheme] = useState('purple');
  const [fontPair, setFontPair] = useState('modern');
  const [useAI, setUseAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Created site
  const [createdSite, setCreatedSite] = useState(null);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Auto-generate subdomain from site name
  useEffect(() => {
    if (siteName && !subdomain) {
      const generated = siteName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30);
      setSubdomain(generated);
    }
  }, [siteName]);

  // Check subdomain availability
  useEffect(() => {
    if (subdomain.length >= 3) {
      const timer = setTimeout(() => checkSubdomain(), 500);
      return () => clearTimeout(timer);
    } else {
      setSubdomainAvailable(null);
    }
  }, [subdomain]);

  const checkSubdomain = async () => {
    if (!subdomain || subdomain.length < 3) return;
    
    setCheckingSubdomain(true);
    try {
      const res = await fetch(`${API_URL}/api/sites/domain/check?subdomain=${subdomain}`, getAuth());
      const data = await res.json();
      setSubdomainAvailable(data.available !== false);
    } catch (err) {
      console.error('Check subdomain error:', err);
      setSubdomainAvailable(true); // Assume available on error
    }
    setCheckingSubdomain(false);
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiGenerating(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/api/ai/generate-site`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuth().headers
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      
      const data = await res.json();
      
      if (data.site) {
        setSiteName(data.site.name || '');
        setSiteDescription(data.site.description || '');
        if (data.site.template) setSelectedTemplate(data.site.template);
        if (data.site.colorTheme) setColorTheme(data.site.colorTheme);
      }
    } catch (err) {
      console.error('AI generation error:', err);
      setError('AI generation failed. Please try again.');
    }
    
    setAiGenerating(false);
  };

  const createSite = async () => {
    if (!siteName || !subdomain || !selectedTemplate) {
      setError('Please complete all required fields');
      return;
    }

    if (subdomainAvailable === false) {
      setError('Please choose an available subdomain');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/sites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuth().headers
        },
        body: JSON.stringify({
          name: siteName,
          description: siteDescription,
          subdomain: subdomain.toLowerCase(),
          template: selectedTemplate,
          theme: {
            colorTheme,
            fontPair,
            colors: COLOR_THEMES.find(t => t.id === colorTheme),
            fonts: FONT_PAIRS.find(f => f.id === fontPair)
          }
        })
      });

      const data = await res.json();

      if (data.ok || data.site) {
        setCreatedSite(data.site);
        setStep(5); // Success step
      } else {
        setError(data.error || 'Failed to create site');
      }
    } catch (err) {
      console.error('Create site error:', err);
      setError('Failed to create site. Please try again.');
    }

    setLoading(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return siteName.length >= 2 && subdomain.length >= 3 && subdomainAvailable !== false;
      case 2: return selectedTemplate !== null;
      case 3: return true; // Theme selection is optional
      case 4: return true; // Review step
      default: return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && step < 4) {
      setStep(step + 1);
      setError('');
    } else if (step === 4) {
      createSite();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  return (
    <>
      <Head>
        <title>Create Website - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-sm bg-black/20">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/studio">
              <button className="flex items-center gap-2 text-white/80 hover:text-white transition">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Studio</span>
              </button>
            </Link>
            
            <div className="flex items-center gap-2 text-white">
              <Globe className="w-6 h-6 text-purple-400" />
              <span className="font-bold text-lg">AI Website Builder</span>
            </div>

            <div className="w-32" /> {/* Spacer */}
          </div>
        </div>

        {/* Progress Steps */}
        {step < 5 && (
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
              {['Site Info', 'Template', 'Theme', 'Review'].map((label, idx) => (
                <div key={idx} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step > idx + 1 
                      ? 'bg-green-500 text-white' 
                      : step === idx + 1 
                        ? 'bg-purple-500 text-white ring-4 ring-purple-500/30' 
                        : 'bg-white/10 text-white/50'
                  }`}>
                    {step > idx + 1 ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`ml-2 font-medium hidden sm:block ${
                    step >= idx + 1 ? 'text-white' : 'text-white/50'
                  }`}>
                    {label}
                  </span>
                  {idx < 3 && (
                    <div className={`w-12 sm:w-20 h-1 mx-2 rounded ${
                      step > idx + 1 ? 'bg-green-500' : 'bg-white/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 pb-20">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Site Info */}
          {step === 1 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Name Your Website</h2>
              <p className="text-white/60 mb-6">Choose a name and URL for your new website</p>

              {/* AI Generation Option */}
              <div className="mb-6 p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-white">Generate with AI</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe your website idea..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={generateWithAI}
                    disabled={aiGenerating || !aiPrompt.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 font-medium mb-2">Site Name *</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="My Awesome Website"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-2">Description</label>
                  <textarea
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    placeholder="What is your website about?"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-2">Website URL *</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="your-site"
                        className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none"
                      />
                      <span className="px-3 text-white/60">.cybev.io</span>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      {checkingSubdomain ? (
                        <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
                      ) : subdomainAvailable === true ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : subdomainAvailable === false ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : null}
                    </div>
                  </div>
                  {subdomainAvailable === false && (
                    <p className="mt-2 text-red-400 text-sm">This subdomain is taken. Please choose another.</p>
                  )}
                  {subdomainAvailable === true && subdomain.length >= 3 && (
                    <p className="mt-2 text-green-400 text-sm">✓ This subdomain is available!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Template Selection */}
          {step === 2 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose a Template</h2>
              <p className="text-white/60 mb-6">Select a starting point for your website</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative p-4 rounded-xl text-left transition group ${
                      selectedTemplate === template.id
                        ? 'bg-purple-500/30 ring-2 ring-purple-500'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                      <template.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white">{template.name}</h3>
                    <p className="text-sm text-white/60 mt-1">{template.description}</p>
                    
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Theme Selection */}
          {step === 3 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Customize Your Theme</h2>
              <p className="text-white/60 mb-6">Choose colors and fonts for your website</p>

              <div className="space-y-8">
                {/* Color Theme */}
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Color Theme
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {COLOR_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setColorTheme(theme.id)}
                        className={`relative group ${
                          colorTheme === theme.id ? 'ring-2 ring-white ring-offset-2 ring-offset-purple-900' : ''
                        }`}
                      >
                        <div
                          className="w-full aspect-square rounded-xl"
                          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                        />
                        <span className="block text-xs text-white/60 mt-1 text-center">{theme.name}</span>
                        {colorTheme === theme.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-purple-600" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Pair */}
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-purple-400" />
                    Font Style
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {FONT_PAIRS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setFontPair(font.id)}
                        className={`p-4 rounded-xl text-left transition ${
                          fontPair === font.id
                            ? 'bg-purple-500/30 ring-2 ring-purple-500'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg font-bold text-white" style={{ fontFamily: font.heading }}>
                          {font.name}
                        </span>
                        <p className="text-sm text-white/60 mt-1" style={{ fontFamily: font.body }}>
                          {font.heading} + {font.body}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Review & Create</h2>
              <p className="text-white/60 mb-6">Review your website settings before creating</p>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <label className="text-white/60 text-sm">Site Name</label>
                  <p className="text-white font-medium text-lg">{siteName}</p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <label className="text-white/60 text-sm">Website URL</label>
                  <p className="text-white font-medium text-lg">
                    <span className="text-purple-400">{subdomain}</span>.cybev.io
                  </p>
                </div>

                {siteDescription && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <label className="text-white/60 text-sm">Description</label>
                    <p className="text-white">{siteDescription}</p>
                  </div>
                )}

                <div className="p-4 bg-white/5 rounded-xl">
                  <label className="text-white/60 text-sm">Template</label>
                  <div className="flex items-center gap-3 mt-1">
                    {(() => {
                      const t = TEMPLATES.find(t => t.id === selectedTemplate);
                      if (!t) return null;
                      return (
                        <>
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                            <t.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white font-medium">{t.name}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <label className="text-white/60 text-sm">Theme</label>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ background: COLOR_THEMES.find(t => t.id === colorTheme)?.primary }}
                      />
                      <span className="text-white">{COLOR_THEMES.find(t => t.id === colorTheme)?.name}</span>
                    </div>
                    <span className="text-white/40">•</span>
                    <span className="text-white">{FONT_PAIRS.find(f => f.id === fontPair)?.name} fonts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && createdSite && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Website Created! 🎉</h2>
              <p className="text-white/60 mb-6">Your website is ready to be customized</p>

              <div className="p-4 bg-white/5 rounded-xl mb-6 inline-block">
                <p className="text-white/60 text-sm">Your website URL</p>
                <a
                  href={`https://${subdomain}.cybev.io`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 text-xl font-bold hover:text-purple-300"
                >
                  {subdomain}.cybev.io
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push(`/studio/sites/${createdSite._id || createdSite.subdomain}/edit`)}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Customize Website
                </button>
                <a
                  href={`https://${subdomain}.cybev.io`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Preview Website
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link href="/studio">
                  <span className="text-white/60 hover:text-white cursor-pointer">
                    ← Back to Studio
                  </span>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={nextStep}
                disabled={!canProceed() || loading}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : step === 4 ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Create Website
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
