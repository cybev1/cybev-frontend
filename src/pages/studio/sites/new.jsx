// ============================================
// FILE: src/pages/studio/sites/new.jsx
// AI Website Builder - Enhanced with Image Generation
// VERSION: 2.0
// ============================================

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, Loader2, Sparkles, Globe, Eye,
  Briefcase, ShoppingBag, Users, BookOpen, Camera, Music, Rocket, Zap,
  AlertCircle, CheckCircle, Palette, Type, Wand2, Image as ImageIcon
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Templates with preview images
const TEMPLATES = [
  { id: 'business', name: 'Business', icon: Briefcase, color: 'from-blue-500 to-indigo-600', desc: 'Professional company website' },
  { id: 'portfolio', name: 'Portfolio', icon: Camera, color: 'from-purple-500 to-pink-500', desc: 'Showcase your work' },
  { id: 'blog', name: 'Blog', icon: BookOpen, color: 'from-green-500 to-emerald-500', desc: 'Share your stories' },
  { id: 'shop', name: 'E-Commerce', icon: ShoppingBag, color: 'from-orange-500 to-red-500', desc: 'Sell products online' },
  { id: 'startup', name: 'Startup', icon: Rocket, color: 'from-violet-500 to-purple-600', desc: 'Launch your idea' },
  { id: 'saas', name: 'SaaS', icon: Zap, color: 'from-cyan-500 to-blue-500', desc: 'Software product' },
  { id: 'music', name: 'Music', icon: Music, color: 'from-pink-500 to-rose-500', desc: 'Artist & bands' },
  { id: 'community', name: 'Community', icon: Users, color: 'from-teal-500 to-green-500', desc: 'Build your tribe' }
];

const COLOR_THEMES = [
  { id: 'purple', name: 'Purple', primary: '#7c3aed', secondary: '#ec4899' },
  { id: 'blue', name: 'Blue', primary: '#2563eb', secondary: '#06b6d4' },
  { id: 'green', name: 'Green', primary: '#059669', secondary: '#10b981' },
  { id: 'red', name: 'Red', primary: '#dc2626', secondary: '#f97316' },
  { id: 'orange', name: 'Orange', primary: '#ea580c', secondary: '#facc15' },
  { id: 'pink', name: 'Pink', primary: '#db2777', secondary: '#f472b6' },
  { id: 'teal', name: 'Teal', primary: '#0d9488', secondary: '#22d3d8' },
  { id: 'indigo', name: 'Indigo', primary: '#4f46e5', secondary: '#818cf8' }
];

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
  const { template: urlTemplate } = router.query;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdSite, setCreatedSite] = useState(null);
  
  // Form data
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState(urlTemplate || '');
  const [colorTheme, setColorTheme] = useState('purple');
  const [fontPair, setFontPair] = useState('modern');
  const [aiPrompt, setAiPrompt] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  
  // Subdomain check
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    if (urlTemplate) setTemplate(urlTemplate);
  }, [urlTemplate]);

  // Auto-generate subdomain from name
  useEffect(() => {
    if (name && !subdomain) {
      const auto = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
      setSubdomain(auto);
    }
  }, [name]);

  // Check subdomain availability
  const checkSubdomain = useCallback(async (sub) => {
    if (!sub || sub.length < 3) {
      setSubdomainAvailable(null);
      return;
    }
    
    setCheckingSubdomain(true);
    try {
      const res = await fetch(`${API_URL}/api/sites/domain/check?subdomain=${sub}`);
      const data = await res.json();
      setSubdomainAvailable(data.available !== false);
    } catch (err) {
      setSubdomainAvailable(true);
    }
    setCheckingSubdomain(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => checkSubdomain(subdomain), 500);
    return () => clearTimeout(timer);
  }, [subdomain, checkSubdomain]);

  // Generate AI site content
  const generateAISite = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/api/ai/generate-site`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ prompt: aiPrompt, template })
      });
      
      const data = await res.json();
      
      if (data.ok && data.suggestion) {
        setName(data.suggestion.name);
        setSubdomain(data.suggestion.subdomain);
        setDescription(data.suggestion.description);
        setTemplate(data.suggestion.template);
        setColorTheme(data.suggestion.colorTheme || 'purple');
        setAiPreview(data.suggestion);
        setUseAI(true);
      } else {
        throw new Error(data.error || 'AI generation failed');
      }
    } catch (err) {
      setError(err.message);
    }
    
    setAiLoading(false);
  };

  // Create site
  const createSite = async () => {
    if (!name || !subdomain || !template) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (subdomainAvailable === false) {
      setError('Subdomain is not available');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const colors = COLOR_THEMES.find(c => c.id === colorTheme) || COLOR_THEMES[0];
      const fonts = FONT_PAIRS.find(f => f.id === fontPair) || FONT_PAIRS[0];
      
      // Use AI endpoint if AI was used
      const endpoint = useAI ? '/api/ai/create-site' : '/api/sites';
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({
          name,
          subdomain,
          description,
          template,
          prompt: aiPrompt,
          theme: {
            colorTheme,
            fontPair,
            colors: { primary: colors.primary, secondary: colors.secondary },
            fonts: { heading: fonts.heading, body: fonts.body }
          }
        })
      });
      
      const data = await res.json();
      
      if (data.ok && data.site) {
        setCreatedSite(data.site);
        setStep(5); // Success
      } else {
        throw new Error(data.error || 'Failed to create site');
      }
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.length >= 2 && subdomain.length >= 3 && subdomainAvailable !== false;
      case 2: return !!template;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  // Progress indicator
  const steps = ['Site Info', 'Template', 'Theme', 'Review'];

  return (
    <>
      <Head>
        <title>Create Website - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        {/* Header */}
        <div className="border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/studio">
              <button className="flex items-center gap-2 text-white/70 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
                Back to Studio
              </button>
            </Link>
            <span className="text-white/50">Step {step} of 4</span>
          </div>
        </div>

        {/* Progress */}
        {step < 5 && (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
              {steps.map((label, idx) => (
                <div key={idx} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    idx + 1 < step ? 'bg-green-500 text-white' :
                    idx + 1 === step ? 'bg-purple-500 text-white ring-4 ring-purple-500/30' :
                    'bg-white/10 text-white/50'
                  }`}>
                    {idx + 1 < step ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`ml-2 hidden sm:block ${idx + 1 === step ? 'text-white' : 'text-white/50'}`}>
                    {label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div className={`w-16 sm:w-24 h-1 mx-4 rounded ${idx + 1 < step ? 'bg-green-500' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          {/* Step 1: Site Info + AI */}
          {step === 1 && (
            <div className="space-y-8">
              {/* AI Generation */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Website Generator</h3>
                    <p className="text-white/60 text-sm">Describe your website and let AI create it</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., A modern portfolio for a photographer named John"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={generateAISite}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Generate
                  </button>
                </div>
                {aiPreview?.heroImage && (
                  <div className="mt-4 rounded-xl overflow-hidden">
                    <img src={aiPreview.heroImage} alt="Preview" className="w-full h-40 object-cover" />
                    <p className="text-center text-white/60 text-sm mt-2">AI-generated preview image</p>
                  </div>
                )}
              </div>

              <div className="text-center text-white/40">— or enter details manually —</div>

              {/* Manual Input */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Site Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Awesome Website"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Subdomain *</label>
                  <div className="flex items-center bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                    <input
                      type="text"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="mysite"
                      className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none"
                    />
                    <span className="px-4 py-3 bg-white/5 text-white/60">.cybev.io</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {checkingSubdomain && <Loader2 className="w-4 h-4 text-white/50 animate-spin" />}
                    {!checkingSubdomain && subdomainAvailable === true && subdomain.length >= 3 && (
                      <span className="text-green-400 text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Available
                      </span>
                    )}
                    {!checkingSubdomain && subdomainAvailable === false && (
                      <span className="text-red-400 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Already taken
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell visitors what your site is about..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Template */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Choose a Template</h2>
                <p className="text-white/60">Select the style that best fits your needs</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      template === t.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    {template === t.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4 mx-auto`}>
                      <t.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{t.name}</h3>
                    <p className="text-white/50 text-sm">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Theme */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Customize Theme</h2>
                <p className="text-white/60">Pick colors and fonts for your site</p>
              </div>

              {/* Colors */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">Color Theme</h3>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {COLOR_THEMES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColorTheme(c.id)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                        colorTheme === c.id ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
                    >
                      {colorTheme === c.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fonts */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">Font Style</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FONT_PAIRS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontPair(f.id)}
                      className={`p-4 rounded-xl border-2 transition text-left ${
                        fontPair === f.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <p className="text-white font-semibold mb-1" style={{ fontFamily: f.heading }}>{f.name}</p>
                      <p className="text-white/50 text-sm" style={{ fontFamily: f.body }}>{f.heading} + {f.body}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Review & Create</h2>
                <p className="text-white/60">Make sure everything looks good</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Site Name</span>
                  <span className="text-white font-medium">{name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">URL</span>
                  <span className="text-purple-400 font-medium">{subdomain}.cybev.io</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Template</span>
                  <span className="text-white font-medium capitalize">{template}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Color Theme</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ background: COLOR_THEMES.find(c => c.id === colorTheme)?.primary }}
                    />
                    <span className="text-white font-medium capitalize">{colorTheme}</span>
                  </div>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-white/60">Font Style</span>
                  <span className="text-white font-medium capitalize">{fontPair}</span>
                </div>
              </div>

              {aiPreview?.heroImage && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <p className="text-white/60 text-sm mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> AI-generated preview
                  </p>
                  <img src={aiPreview.heroImage} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                </div>
              )}
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && createdSite && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Website Created!</h2>
              <p className="text-white/60 mb-8">Your website is ready to customize</p>
              
              <div className="bg-white/10 rounded-xl p-4 mb-8 max-w-md mx-auto">
                <p className="text-white/60 text-sm mb-1">Your site URL</p>
                <p className="text-purple-400 font-mono text-lg">cybev.io/s/{createdSite.subdomain}</p>
              </div>

              <div className="flex justify-center gap-4">
                <Link href={`/studio/sites/${createdSite._id}/edit`}>
                  <button className="px-8 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 flex items-center gap-2">
                    Customize Website
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href={`/s/${createdSite.subdomain}`}>
                  <button className="px-8 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Navigation */}
          {step < 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 disabled:opacity-30 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              
              {step < 4 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 disabled:opacity-30 flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={createSite}
                  disabled={loading || !canProceed()}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-30 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Create Website
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
