// ============================================
// FILE: src/pages/studio/sites/new.jsx
// CYBEV AI Website Generator - CLEAN WHITE DESIGN
// VERSION: 7.1.0 - Solid white, black text, readable
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import {
  Globe, ArrowLeft, ArrowRight, Loader2, Check, Wand2, Sparkles,
  Layout, Palette, Type, Image as ImageIcon, Settings, Eye, Rocket,
  RefreshCw, ChevronDown, AlertCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const TEMPLATES = [
  { id: 'portfolio', name: 'Portfolio', desc: 'Showcase your work', icon: '🎨' },
  { id: 'business', name: 'Business', desc: 'Professional company site', icon: '💼' },
  { id: 'blog', name: 'Blog', desc: 'Personal blog site', icon: '📝' },
  { id: 'church', name: 'Church', desc: 'Ministry website', icon: '⛪' },
  { id: 'store', name: 'Store', desc: 'E-commerce ready', icon: '🛒' },
  { id: 'landing', name: 'Landing Page', desc: 'Single page site', icon: '🚀' },
];

const COLOR_SCHEMES = [
  { id: 'purple', name: 'Purple', primary: '#7c3aed', secondary: '#ec4899' },
  { id: 'blue', name: 'Blue', primary: '#3b82f6', secondary: '#06b6d4' },
  { id: 'green', name: 'Green', primary: '#10b981', secondary: '#84cc16' },
  { id: 'orange', name: 'Orange', primary: '#f97316', secondary: '#eab308' },
  { id: 'red', name: 'Red', primary: '#ef4444', secondary: '#f97316' },
  { id: 'dark', name: 'Dark', primary: '#1f2937', secondary: '#4b5563' },
];

export default function CreateSitePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiDescription, setAiDescription] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    description: '',
    template: 'portfolio',
    colorScheme: 'purple',
    useAI: false
  });

  const [errors, setErrors] = useState({});

  const validateSubdomain = (value) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, subdomain: cleaned });
    return cleaned;
  };

  const handleAIGenerate = async () => {
    if (!aiDescription.trim()) {
      toast.error('Please describe your website');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/sites/generate-ai', {
        description: aiDescription
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 120000
      });

      if (res.data.ok || res.data.suggestion) {
        const suggestion = res.data.suggestion || res.data;
        setFormData({
          ...formData,
          name: suggestion.name || formData.name,
          description: suggestion.description || aiDescription,
          template: suggestion.template || 'portfolio',
          useAI: true
        });
        toast.success('AI generated your website details!');
        setStep(2);
      }
    } catch (err) {
      toast.error('AI generation failed. Please fill manually.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreate = async () => {
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Site name is required';
    if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required';
    if (formData.subdomain.length < 3) newErrors.subdomain = 'Subdomain must be at least 3 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to create websites');
        router.push('/auth/login');
        return;
      }

      const res = await api.post('/api/sites', {
        name: formData.name,
        subdomain: formData.subdomain,
        description: formData.description,
        template: formData.template,
        colorScheme: formData.colorScheme,
        status: 'draft'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.ok || res.data.success || res.data.site) {
        toast.success('Website created!');
        router.push(`/studio/sites/${res.data.site?._id || res.data._id}/edit`);
      } else {
        toast.error(res.data.message || 'Failed to create website');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create website';
      toast.error(errorMsg);
      if (errorMsg.includes('subdomain')) {
        setErrors({ subdomain: 'This subdomain is already taken' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Create Website | CYBEV</title>
      </Head>

      {/* SOLID WHITE BACKGROUND - NO GRADIENTS */}
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link href="/studio">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium">
                <ArrowLeft className="w-5 h-5" />
                Back to Studio
              </button>
            </Link>

            {/* Title - BLACK TEXT */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Website</h1>
              <p className="text-gray-600">Build a stunning website in minutes with AI</p>
            </div>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= s 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  <span className={`ml-2 font-medium hidden sm:block ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s === 1 ? 'Details' : s === 2 ? 'Design' : 'Review'}
                  </span>
                  {s < 3 && <div className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 rounded ${step > s ? 'bg-purple-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-6">
              {/* AI Generator Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">AI Website Generator</h3>
                    <p className="text-gray-600 text-sm mb-4">Describe your website and let AI create it</p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={aiDescription}
                        onChange={(e) => setAiDescription(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., A modern portfolio for a photographer named John"
                      />
                      <button
                        onClick={handleAIGenerate}
                        disabled={generating || !aiDescription.trim()}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                      >
                        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Form */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Or fill in manually</h2>

                <div className="space-y-5">
                  {/* Site Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Site Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="My Awesome Website"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Subdomain */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subdomain <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={formData.subdomain}
                        onChange={(e) => validateSubdomain(e.target.value)}
                        className={`flex-1 px-4 py-3 bg-gray-50 border rounded-l-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all ${
                          errors.subdomain ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="mysite"
                      />
                      <div className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl text-gray-500 font-medium">
                        .cybev.io
                      </div>
                    </div>
                    {errors.subdomain && <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>}
                    {formData.subdomain && !errors.subdomain && (
                      <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Your site will be at: {formData.subdomain}.cybev.io
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all resize-none"
                      placeholder="Describe what your site is about..."
                    />
                  </div>
                </div>

                {/* Next Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.name.trim() || !formData.subdomain.trim()}
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-all"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Design */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Choose your design</h2>
              <p className="text-gray-600 mb-6">Select a template and color scheme</p>

              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Template</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setFormData({ ...formData, template: template.id })}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          formData.template === template.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <span className="text-3xl block mb-2">{template.icon}</span>
                        <p className={`font-semibold ${formData.template === template.id ? 'text-purple-600' : 'text-gray-900'}`}>
                          {template.name}
                        </p>
                        <p className="text-xs text-gray-500">{template.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Scheme */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Color Scheme</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {COLOR_SCHEMES.map((scheme) => (
                      <button
                        key={scheme.id}
                        onClick={() => setFormData({ ...formData, colorScheme: scheme.id })}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          formData.colorScheme === scheme.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-lg mx-auto mb-2"
                          style={{ background: `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 100%)` }}
                        />
                        <p className={`text-sm font-medium ${formData.colorScheme === scheme.id ? 'text-purple-600' : 'text-gray-700'}`}>
                          {scheme.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center gap-2 shadow-lg transition-all"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Review your website</h2>

                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Site Name</span>
                    <span className="font-semibold text-gray-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">URL</span>
                    <span className="font-semibold text-purple-600">{formData.subdomain}.cybev.io</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Template</span>
                    <span className="font-semibold text-gray-900">
                      {TEMPLATES.find(t => t.id === formData.template)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Color Scheme</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ background: COLOR_SCHEMES.find(c => c.id === formData.colorScheme)?.primary }}
                      />
                      <span className="font-semibold text-gray-900">
                        {COLOR_SCHEMES.find(c => c.id === formData.colorScheme)?.name}
                      </span>
                    </div>
                  </div>
                  {formData.description && (
                    <div className="py-3">
                      <span className="text-gray-600 block mb-2">Description</span>
                      <p className="text-gray-900">{formData.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        Create Website
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
