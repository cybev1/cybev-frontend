// ============================================
// FILE: src/pages/studio/sites/new.jsx
// AI Website Builder - Creation Wizard
// VERSION: 1.0
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  Sparkles,
  Globe,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Palette,
  Layout,
  Type,
  Image,
  Briefcase,
  Camera,
  Music,
  Church,
  Mic,
  Newspaper,
  User,
  Code,
  ShoppingBag
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  { id: 'personal-blog', label: 'Personal Blog', icon: User, description: 'Share your thoughts and stories' },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase, description: 'Showcase your work' },
  { id: 'business', label: 'Business', icon: Briefcase, description: 'Professional company site' },
  { id: 'photography', label: 'Photography', icon: Camera, description: 'Visual gallery' },
  { id: 'music', label: 'Music', icon: Music, description: 'Artist or band site' },
  { id: 'church', label: 'Church/Ministry', icon: Church, description: 'Faith-based website' },
  { id: 'podcast', label: 'Podcast', icon: Mic, description: 'Audio content hub' },
  { id: 'magazine', label: 'News/Magazine', icon: Newspaper, description: 'Multi-author publication' },
  { id: 'agency', label: 'Agency', icon: Code, description: 'Creative services' },
  { id: 'ecommerce', label: 'Store (Coming Soon)', icon: ShoppingBag, description: 'Sell products', disabled: true }
];

const TEMPLATES = {
  'personal-blog': ['minimal', 'writer', 'modern'],
  'portfolio': ['portfolio', 'gallery', 'minimal'],
  'business': ['corporate', 'startup', 'agency'],
  'photography': ['photographer', 'gallery', 'minimal'],
  'music': ['musician', 'dark', 'minimal'],
  'church': ['church', 'ministry', 'warm'],
  'podcast': ['podcast', 'audio', 'dark'],
  'magazine': ['magazine', 'news', 'modern'],
  'agency': ['agency', 'corporate', 'creative']
};

const TEMPLATE_PREVIEWS = {
  minimal: { primary: '#7c3aed', name: 'Minimal', style: 'Clean and simple' },
  writer: { primary: '#1f2937', name: 'Writer', style: 'Typography focused' },
  modern: { primary: '#3b82f6', name: 'Modern', style: 'Bold and fresh' },
  portfolio: { primary: '#ec4899', name: 'Portfolio', style: 'Work showcase' },
  gallery: { primary: '#10b981', name: 'Gallery', style: 'Image centric' },
  corporate: { primary: '#1e40af', name: 'Corporate', style: 'Professional' },
  startup: { primary: '#8b5cf6', name: 'Startup', style: 'Dynamic' },
  agency: { primary: '#f59e0b', name: 'Agency', style: 'Creative' },
  photographer: { primary: '#111827', name: 'Photographer', style: 'Dark minimal' },
  musician: { primary: '#dc2626', name: 'Musician', style: 'Bold dark' },
  dark: { primary: '#18181b', name: 'Dark', style: 'Sleek dark mode' },
  church: { primary: '#7c3aed', name: 'Church', style: 'Warm welcoming' },
  ministry: { primary: '#2563eb', name: 'Ministry', style: 'Faith focused' },
  warm: { primary: '#d97706', name: 'Warm', style: 'Inviting' },
  podcast: { primary: '#7c3aed', name: 'Podcast', style: 'Audio ready' },
  audio: { primary: '#059669', name: 'Audio', style: 'Player focused' },
  magazine: { primary: '#dc2626', name: 'Magazine', style: 'Editorial' },
  news: { primary: '#1f2937', name: 'News', style: 'Article grid' },
  creative: { primary: '#ec4899', name: 'Creative', style: 'Artistic' }
};

export default function NewSitePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Form state
  const [category, setCategory] = useState('');
  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('minimal');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);
  const [useAi, setUseAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const totalSteps = 4;

  const checkSubdomain = async (value) => {
    if (value.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/sites/domain/check?subdomain=${value}`);
      setSubdomainAvailable(res.data.available);
    } catch (error) {
      console.error('Check subdomain error:', error);
    }
  };

  const generateWithAi = async () => {
    if (!aiPrompt) return;

    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/sites/ai/generate`,
        {
          prompt: aiPrompt,
          category,
          style: template
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.ok) {
        router.push(`/studio/sites/${res.data.site._id}`);
      }
    } catch (error) {
      console.error('AI generate error:', error);
      alert('Failed to generate website. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const createSite = async () => {
    if (!siteName) {
      alert('Please enter a site name');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/sites`,
        {
          name: siteName,
          tagline,
          category,
          template
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.ok) {
        // Update subdomain if custom one provided
        if (subdomain && subdomain !== res.data.site.subdomain) {
          await axios.put(
            `${API_URL}/api/sites/${res.data.site._id}/subdomain`,
            { subdomain },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        router.push(`/studio/sites/${res.data.site._id}`);
      }
    } catch (error) {
      console.error('Create site error:', error);
      alert(error.response?.data?.error || 'Failed to create website');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return category !== '';
      case 2: return siteName.trim() !== '';
      case 3: return template !== '';
      case 4: return subdomain.length >= 3 && subdomainAvailable !== false;
      default: return true;
    }
  };

  return (
    <>
      <Head>
        <title>Create Website | CYBEV Studio</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                {step > 1 ? 'Back' : 'Cancel'}
              </button>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(s => (
                  <div
                    key={s}
                    className={`w-8 h-1 rounded-full ${
                      s <= step ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                Step {step} of {totalSteps}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Step 1: Choose Category */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  What kind of website?
                </h1>
                <p className="text-gray-500 mt-2">
                  Choose a category to get started with the right template
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => !cat.disabled && setCategory(cat.id)}
                    disabled={cat.disabled}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      category === cat.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : cat.disabled
                          ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <cat.icon className={`w-8 h-8 mb-2 ${
                      category === cat.id ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <div className="font-medium text-gray-900 dark:text-white">
                      {cat.label}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {cat.description}
                    </div>
                    {cat.disabled && (
                      <span className="text-xs text-orange-500 mt-2 block">Coming Soon</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Site Details */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tell us about your website
                </h1>
                <p className="text-gray-500 mt-2">
                  This helps us create the perfect starting point
                </p>
              </div>

              {/* AI Generation Option */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-6 text-white">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-8 h-8 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Generate with AI</h3>
                    <p className="text-purple-100 text-sm mt-1">
                      Describe your website and let AI create it for you
                    </p>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="E.g., A photography portfolio showcasing my landscape and street photography work, with a dark minimal aesthetic..."
                      className="w-full mt-3 p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
                      rows={3}
                    />
                    <button
                      onClick={generateWithAi}
                      disabled={!aiPrompt || aiLoading}
                      className="mt-3 px-4 py-2 bg-white text-purple-600 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Website
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 text-sm">
                    Or enter details manually
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website Name *
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="My Amazing Website"
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="A short description of your website"
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell visitors what your website is about..."
                    rows={3}
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Choose Template */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Choose a design
                </h1>
                <p className="text-gray-500 mt-2">
                  Pick a template to start with. You can customize everything later.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(TEMPLATES[category] || TEMPLATES['personal-blog']).map(t => {
                  const preview = TEMPLATE_PREVIEWS[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`rounded-xl border-2 overflow-hidden transition ${
                        template === t
                          ? 'border-purple-500 ring-2 ring-purple-500/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="h-32"
                        style={{ backgroundColor: preview.primary }}
                      >
                        <div className="h-full flex items-center justify-center">
                          <Layout className="w-12 h-12 text-white/30" />
                        </div>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {preview.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {preview.style}
                        </div>
                      </div>
                      {template === t && (
                        <div className="bg-purple-600 text-white text-sm py-1 text-center">
                          <Check className="w-4 h-4 inline" /> Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Choose Domain */}
          {step === 4 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Choose your web address
                </h1>
                <p className="text-gray-500 mt-2">
                  Pick a subdomain for your website. You can add a custom domain later.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your URL
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setSubdomain(value);
                      checkSubdomain(value);
                    }}
                    placeholder="mywebsite"
                    className="flex-1 px-4 py-3 border dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-l-0 dark:border-gray-600 rounded-r-lg text-gray-600 dark:text-gray-300">
                    .cybev.io
                  </span>
                </div>

                {subdomain.length >= 3 && (
                  <div className={`mt-2 text-sm flex items-center gap-1 ${
                    subdomainAvailable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subdomainAvailable ? (
                      <>
                        <Check className="w-4 h-4" />
                        {subdomain}.cybev.io is available!
                      </>
                    ) : subdomainAvailable === false ? (
                      <>
                        <span className="w-4 h-4">✗</span>
                        This subdomain is taken
                      </>
                    ) : null}
                  </div>
                )}

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Want to use your own domain?
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    You can connect a custom domain like <strong>yourname.com</strong> after creating your site.
                  </p>
                  <div className="text-sm text-purple-600">
                    Available in site settings after creation →
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
                  Summary
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-purple-700 dark:text-purple-300">Website:</dt>
                    <dd className="text-purple-900 dark:text-purple-100 font-medium">{siteName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-purple-700 dark:text-purple-300">Category:</dt>
                    <dd className="text-purple-900 dark:text-purple-100">{CATEGORIES.find(c => c.id === category)?.label}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-purple-700 dark:text-purple-300">Template:</dt>
                    <dd className="text-purple-900 dark:text-purple-100">{TEMPLATE_PREVIEWS[template]?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-purple-700 dark:text-purple-300">URL:</dt>
                    <dd className="text-purple-900 dark:text-purple-100">{subdomain}.cybev.io</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={createSite}
                disabled={loading || !canProceed()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Create Website
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
