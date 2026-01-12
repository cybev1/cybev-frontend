// ============================================
// FILE: pages/church/website/index.jsx
// Church Website Templates - Selection & Generator
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Globe, Layout, Palette, Eye, ChevronRight, Check,
  ArrowLeft, Loader2, Sparkles, Church, Calendar,
  Video, Users, Phone, Mail, MapPin, Clock, Star,
  ExternalLink, Edit, RefreshCw, Zap
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Template configurations
const templates = [
  {
    id: 'modern',
    name: 'Modern Church',
    description: 'Clean, contemporary design with bold imagery',
    preview: '/templates/modern-church.png',
    colors: ['#8b5cf6', '#3b82f6', '#06b6d4'],
    features: ['Hero video', 'Service times', 'Events grid', 'Live stream'],
    popular: true
  },
  {
    id: 'classic',
    name: 'Classic Worship',
    description: 'Traditional elegant design with warm tones',
    preview: '/templates/classic-worship.png',
    colors: ['#b45309', '#78350f', '#451a03'],
    features: ['Image slider', 'About section', 'Pastor message', 'Contact form']
  },
  {
    id: 'vibrant',
    name: 'Vibrant Community',
    description: 'Colorful and energetic for growing churches',
    preview: '/templates/vibrant-community.png',
    colors: ['#ec4899', '#f97316', '#eab308'],
    features: ['Animated hero', 'Ministry cards', 'Testimonials', 'Newsletter']
  },
  {
    id: 'minimal',
    name: 'Minimal Grace',
    description: 'Simple and focused on content',
    preview: '/templates/minimal-grace.png',
    colors: ['#1f2937', '#4b5563', '#9ca3af'],
    features: ['Clean layout', 'Typography focus', 'Whitespace', 'Fast loading']
  },
  {
    id: 'african',
    name: 'African Heritage',
    description: 'Celebrates African Christian culture',
    preview: '/templates/african-heritage.png',
    colors: ['#dc2626', '#16a34a', '#eab308'],
    features: ['Cultural patterns', 'Bold colors', 'Community focus', 'Music']
  },
  {
    id: 'mega',
    name: 'Mega Church',
    description: 'Full-featured for large congregations',
    preview: '/templates/mega-church.png',
    colors: ['#7c3aed', '#2563eb', '#0891b2'],
    features: ['Multiple campuses', 'Media library', 'Events calendar', 'Giving portal']
  }
];

const colorSchemes = [
  { id: 'purple', name: 'Royal Purple', primary: '#8b5cf6', secondary: '#6366f1' },
  { id: 'blue', name: 'Ocean Blue', primary: '#3b82f6', secondary: '#0ea5e9' },
  { id: 'green', name: 'Forest Green', primary: '#22c55e', secondary: '#10b981' },
  { id: 'red', name: 'Crimson Red', primary: '#ef4444', secondary: '#dc2626' },
  { id: 'gold', name: 'Royal Gold', primary: '#f59e0b', secondary: '#d97706' },
  { id: 'teal', name: 'Teal Sea', primary: '#14b8a6', secondary: '#0d9488' },
  { id: 'pink', name: 'Rose Pink', primary: '#ec4899', secondary: '#db2777' },
  { id: 'slate', name: 'Modern Slate', primary: '#475569', secondary: '#334155' }
];

function TemplateCard({ template, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(template.id)}
      className={`relative bg-white dark:bg-white rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group ${
        selected 
          ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
          : 'border-gray-100 dark:border-gray-200 hover:border-purple-300 hover:shadow-lg'
      }`}
    >
      {/* Popular Badge */}
      {template.popular && (
        <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-gray-900 text-xs font-bold rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" />
          Popular
        </div>
      )}

      {/* Selected Checkmark */}
      {selected && (
        <div className="absolute top-3 left-3 z-10 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-gray-900" />
        </div>
      )}

      {/* Preview */}
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
        {template.preview ? (
          <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layout className="w-16 h-16 text-gray-600" />
          </div>
        )}
        
        {/* Color Dots */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {template.colors.map((color, i) => (
            <div 
              key={i} 
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Preview Button */}
        <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-1">{template.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{template.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {template.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-500 rounded">
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="text-xs px-2 py-1 text-purple-600">
              +{template.features.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            i + 1 <= currentStep
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            {i + 1 < currentStep ? <Check className="w-5 h-5" /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 h-1 mx-2 rounded ${
              i + 1 < currentStep ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ChurchWebsiteTemplates() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [myOrgs, setMyOrgs] = useState([]);
  
  // Form state
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedColor, setSelectedColor] = useState('purple');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [siteInfo, setSiteInfo] = useState({
    subdomain: '',
    tagline: '',
    welcomeMessage: '',
    pastorName: '',
    pastorTitle: 'Senior Pastor',
    pastorBio: '',
    enableLiveStream: true,
    enableEvents: true,
    enableGiving: false,
    showServiceTimes: true
  });

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrg && myOrgs.length > 0) {
      const org = myOrgs.find(o => o._id === selectedOrg);
      if (org) {
        setSiteInfo(prev => ({
          ...prev,
          subdomain: org.slug || org.name.toLowerCase().replace(/\s+/g, '-'),
          tagline: org.motto || '',
          pastorName: org.leader?.name || ''
        }));
      }
    }
  }, [selectedOrg, myOrgs]);

  const fetchOrgs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const data = await res.json();
      if (data.ok && data.orgs?.length > 0) {
        const churches = data.orgs.filter(o => o.type === 'church' || o.type === 'zone');
        setMyOrgs(churches);
        if (churches.length > 0) {
          setSelectedOrg(churches[0]._id);
        }
      }
    } catch (err) {
      console.error('Fetch orgs error:', err);
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!selectedOrg) {
      alert('Please select an organization');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch(`${API_URL}/api/sites/generate`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          organizationId: selectedOrg,
          template: selectedTemplate,
          colorScheme: selectedColor,
          subdomain: siteInfo.subdomain,
          metadata: {
            tagline: siteInfo.tagline,
            welcomeMessage: siteInfo.welcomeMessage,
            pastor: {
              name: siteInfo.pastorName,
              title: siteInfo.pastorTitle,
              bio: siteInfo.pastorBio
            },
            features: {
              liveStream: siteInfo.enableLiveStream,
              events: siteInfo.enableEvents,
              giving: siteInfo.enableGiving,
              serviceTimes: siteInfo.showServiceTimes
            }
          }
        })
      });

      const data = await res.json();
      
      if (data.ok || data.success) {
        router.push(`/studio/site/${data.site?._id || data.siteId}?generated=true`);
      } else {
        alert(data.error || 'Failed to generate website');
      }
    } catch (err) {
      console.error('Generate error:', err);
      alert('Failed to generate website');
    }
    setGenerating(false);
  };

  const steps = ['Template', 'Customize', 'Content', 'Generate'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
      <Head>
        <title>Church Website Templates - CYBEV</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-purple-200 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="w-8 h-8" />
            Church Website Builder
          </h1>
          <p className="text-purple-100 mt-1">
            Create a beautiful website for your church in minutes
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={step} steps={steps} />

        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">
                Choose a Template
              </h2>
              <p className="text-gray-500">
                Select a design that matches your church's style
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {templates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={selectedTemplate === template.id}
                  onSelect={setSelectedTemplate}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-purple-600 text-gray-900 rounded-xl font-semibold hover:bg-purple-700 flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customize */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">
                Customize Your Site
              </h2>
              <p className="text-gray-500">
                Choose colors and configure features
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
              {/* Organization Selection */}
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
                  <Church className="w-5 h-5 text-purple-500" />
                  Select Organization
                </h3>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                >
                  {myOrgs.map(org => (
                    <option key={org._id} value={org._id}>{org.name}</option>
                  ))}
                </select>
              </div>

              {/* Color Scheme */}
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-500" />
                  Color Scheme
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {colorSchemes.map(scheme => (
                    <button
                      key={scheme.id}
                      onClick={() => setSelectedColor(scheme.id)}
                      className={`p-3 rounded-xl border-2 transition ${
                        selectedColor === scheme.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex gap-1 justify-center mb-2">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.primary }} />
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.secondary }} />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-500 text-center">{scheme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subdomain */}
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-500" />
                  Website Address
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={siteInfo.subdomain}
                    onChange={(e) => setSiteInfo(prev => ({ ...prev, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                    placeholder="your-church"
                  />
                  <span className="text-gray-500 font-medium">.cybev.io</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Your site will be available at: https://{siteInfo.subdomain || 'your-church'}.cybev.io
                </p>
              </div>

              {/* Features */}
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  Features
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'showServiceTimes', label: 'Service Times', icon: Clock, desc: 'Display your weekly service schedule' },
                    { key: 'enableLiveStream', label: 'Live Streaming', icon: Video, desc: 'Embed live streams from CYBEV' },
                    { key: 'enableEvents', label: 'Events Calendar', icon: Calendar, desc: 'Show upcoming church events' },
                    { key: 'enableGiving', label: 'Online Giving', icon: Star, desc: 'Accept tithes and offerings online' }
                  ].map(feature => {
                    const Icon = feature.icon;
                    return (
                      <label key={feature.key} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-100/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={siteInfo[feature.key]}
                          onChange={(e) => setSiteInfo(prev => ({ ...prev, [feature.key]: e.target.checked }))}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <Icon className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-900">{feature.label}</p>
                          <p className="text-sm text-gray-500">{feature.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8 max-w-2xl mx-auto">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-200 dark:border-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-purple-600 text-gray-900 rounded-xl font-semibold hover:bg-purple-700 flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Content */}
        {step === 3 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">
                Add Your Content
              </h2>
              <p className="text-gray-500">
                Fill in the details that make your church unique
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Tagline */}
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                  Church Tagline
                </label>
                <input
                  type="text"
                  value={siteInfo.tagline}
                  onChange={(e) => setSiteInfo(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  placeholder="e.g., A Place of Love, Hope & Faith"
                />
              </div>

              {/* Welcome Message */}
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                  Welcome Message
                </label>
                <textarea
                  value={siteInfo.welcomeMessage}
                  onChange={(e) => setSiteInfo(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 resize-none"
                  placeholder="Welcome to our church! We're a community of believers..."
                />
              </div>

              {/* Pastor Info */}
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">Pastor Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={siteInfo.pastorName}
                        onChange={(e) => setSiteInfo(prev => ({ ...prev, pastorName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700"
                        placeholder="Pastor John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={siteInfo.pastorTitle}
                        onChange={(e) => setSiteInfo(prev => ({ ...prev, pastorTitle: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700"
                        placeholder="Senior Pastor"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={siteInfo.pastorBio}
                      onChange={(e) => setSiteInfo(prev => ({ ...prev, pastorBio: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 resize-none"
                      placeholder="A brief bio about the pastor..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8 max-w-2xl mx-auto">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-200 dark:border-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3 bg-purple-600 text-gray-900 rounded-xl font-semibold hover:bg-purple-700 flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Generate */}
        {step === 4 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">
                Ready to Generate
              </h2>
              <p className="text-gray-500">
                Review your selections and create your website
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Summary */}
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-200">
                    <span className="text-gray-500">Template</span>
                    <span className="font-medium text-gray-900 dark:text-gray-900">
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-200">
                    <span className="text-gray-500">Color Scheme</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colorSchemes.find(c => c.id === selectedColor)?.primary }} />
                      <span className="font-medium text-gray-900 dark:text-gray-900">
                        {colorSchemes.find(c => c.id === selectedColor)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-200">
                    <span className="text-gray-500">URL</span>
                    <span className="font-medium text-purple-600">
                      {siteInfo.subdomain}.cybev.io
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-200">
                    <span className="text-gray-500">Features</span>
                    <span className="font-medium text-gray-900 dark:text-gray-900">
                      {[
                        siteInfo.showServiceTimes && 'Services',
                        siteInfo.enableLiveStream && 'Live',
                        siteInfo.enableEvents && 'Events',
                        siteInfo.enableGiving && 'Giving'
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Organization</span>
                    <span className="font-medium text-gray-900 dark:text-gray-900">
                      {myOrgs.find(o => o._id === selectedOrg)?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Generation Info */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-900 mb-1">
                      AI-Powered Generation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-500">
                      Our AI will generate professional imagery and content based on your church name and settings. 
                      You can customize everything after generation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border border-gray-200 dark:border-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-gray-900 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-500/15"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Website...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Website
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
