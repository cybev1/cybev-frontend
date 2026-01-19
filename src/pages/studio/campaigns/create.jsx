// ============================================
// FILE: src/pages/studio/campaigns/create.jsx
// CYBEV Campaign Creation Wizard - Klaviyo Style
// VERSION: 4.0.0 - Step-by-Step Flow
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Mail, Send, ArrowLeft, ArrowRight, Check, Loader2, Users, Layout,
  Type, Image, Clock, Target, Sparkles, Globe, Settings, Eye,
  ChevronRight, X, Info, Zap, Calendar, MousePointer, BarChart3,
  FileText, Wand2, RefreshCw, Copy, Lightbulb, AlertCircle, Crown
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// ==========================================
// WIZARD STEPS
// ==========================================

const STEPS = [
  { id: 'type', title: 'Campaign Type', description: 'Choose what kind of campaign to create', icon: Mail },
  { id: 'details', title: 'Campaign Details', description: 'Name and subject line', icon: Type },
  { id: 'audience', title: 'Select Audience', description: 'Who should receive this?', icon: Users },
  { id: 'content', title: 'Design Email', description: 'Create your email content', icon: Layout },
  { id: 'review', title: 'Review & Send', description: 'Final check before sending', icon: Send },
];

// ==========================================
// CAMPAIGN TYPES
// ==========================================

const CAMPAIGN_TYPES = [
  { id: 'regular', title: 'Regular Campaign', description: 'Send a one-time email to your subscribers', icon: Mail, color: 'purple' },
  { id: 'automated', title: 'Automated Email', description: 'Trigger based on subscriber actions', icon: Zap, color: 'blue', badge: 'Pro' },
  { id: 'ab-test', title: 'A/B Test', description: 'Test different versions to find what works', icon: BarChart3, color: 'green', badge: 'Pro' },
];

// ==========================================
// AI SUBJECT LINE SUGGESTIONS
// ==========================================

const generateSubjectSuggestions = (campaignName) => {
  const templates = [
    `🎉 ${campaignName} - Don't Miss Out!`,
    `Your Weekly Update from CYBEV`,
    `[New] Check out what's inside...`,
    `Hey {{first_name}}, we've got something for you`,
    `Limited time: Special offer inside 🎁`,
  ];
  return templates;
};

export default function CreateCampaign() {
  const router = useRouter();
  const { templateId } = router.query;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Campaign data
  const [campaign, setCampaign] = useState({
    type: 'regular',
    name: '',
    subject: '',
    previewText: '',
    sender: { email: '', name: '' },
    audience: { type: 'all', tags: [], excludeTags: [], segment: null },
    content: { html: '', blocks: [] },
    schedule: { type: 'immediate', scheduledAt: null },
    tracking: { openTracking: true, clickTracking: true },
  });
  
  // Lists and data
  const [contacts, setContacts] = useState({ total: 0, subscribed: 0 });
  const [tags, setTags] = useState([]);
  const [senderAddresses, setSenderAddresses] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  // AI features
  const [showAISubject, setShowAISubject] = useState(false);
  const [aiSubjects, setAiSubjects] = useState([]);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  const fetchInitialData = async () => {
    try {
      // Use campaigns-enhanced endpoints for all data
      const [statsRes, addressRes, tagsRes] = await Promise.all([
        fetch(`${API_URL}/api/campaigns-enhanced/contacts/stats`, getAuth()).catch(() => ({ json: () => ({ stats: {} }) })),
        fetch(`${API_URL}/api/campaigns-enhanced/addresses`, getAuth()).catch(() => ({ json: () => ({ addresses: [] }) })),
        fetch(`${API_URL}/api/campaigns-enhanced/tags`, getAuth()).catch(() => ({ json: () => ({ tags: [] }) })),
      ]);
      
      const statsData = await statsRes.json();
      const addressData = await addressRes.json();
      const tagsData = await tagsRes.json();
      
      if (statsData.stats) setContacts(statsData.stats);
      if (tagsData.tags) setTags(tagsData.tags);
      if (addressData.addresses) {
        setSenderAddresses(addressData.addresses);
        if (addressData.addresses.length > 0) {
          setCampaign(prev => ({
            ...prev,
            sender: { email: addressData.addresses[0].email, name: addressData.addresses[0].displayName || 'CYBEV' }
          }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  const generateAISubjects = async () => {
    setGeneratingAI(true);
    // Simulate AI generation (in production, call your AI API)
    setTimeout(() => {
      setAiSubjects(generateSubjectSuggestions(campaign.name || 'Newsletter'));
      setGeneratingAI(false);
      setShowAISubject(true);
    }, 1500);
  };

  const updateCampaign = (field, value) => {
    setCampaign(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case 'type': return campaign.type;
      case 'details': return campaign.name && campaign.subject;
      case 'audience': return campaign.audience.type;
      case 'content': return true; // Can proceed to design in editor
      case 'review': return true;
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep === 3) {
      // Save campaign and go to editor
      saveCampaign(true);
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const saveCampaign = async (goToEditor = false) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify(campaign),
      });
      
      const data = await res.json();
      if (data.ok) {
        if (goToEditor) {
          router.push(`/studio/campaigns/editor?id=${data.campaign._id}`);
        } else {
          router.push('/studio/campaigns');
        }
      } else {
        alert(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      alert('Failed to create campaign');
    } finally {
      setSaving(false);
    }
  };

  const sendCampaign = async () => {
    if (!confirm('Send this campaign now?')) return;
    setSaving(true);
    try {
      // First save
      const createRes = await fetch(`${API_URL}/api/campaigns-enhanced`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify(campaign),
      });
      const createData = await createRes.json();
      
      if (createData.ok) {
        // Then send
        const sendRes = await fetch(`${API_URL}/api/campaigns-enhanced/${createData.campaign._id}/send`, {
          method: 'POST',
          ...getAuth(),
        });
        const sendData = await sendRes.json();
        
        if (sendData.ok) {
          alert(`Campaign sending to ${sendData.recipientCount} recipients!`);
          router.push('/studio/campaigns');
        } else {
          alert(sendData.error || 'Failed to send');
        }
      }
    } catch (err) {
      alert('Failed to send campaign');
    } finally {
      setSaving(false);
    }
  };

  const scheduleCampaign = async () => {
    if (!campaign.schedule.scheduledAt) {
      alert('Please select a date and time');
      return;
    }
    setSaving(true);
    try {
      const createRes = await fetch(`${API_URL}/api/campaigns-enhanced`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ ...campaign, schedule: { type: 'scheduled', scheduledAt: campaign.schedule.scheduledAt } }),
      });
      const createData = await createRes.json();
      
      if (createData.ok) {
        const schedRes = await fetch(`${API_URL}/api/campaigns-enhanced/${createData.campaign._id}/schedule`, {
          method: 'POST',
          ...getAuth(),
          body: JSON.stringify({ scheduledAt: campaign.schedule.scheduledAt }),
        });
        const schedData = await schedRes.json();
        
        if (schedData.ok) {
          alert('Campaign scheduled successfully!');
          router.push('/studio/campaigns');
        }
      }
    } catch (err) {
      alert('Failed to schedule campaign');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Create Campaign - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* ==========================================
            TOP PROGRESS BAR
        ========================================== */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4">
            {/* Header */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => router.push('/studio/campaigns')} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Create Campaign</h1>
                  <p className="text-sm text-gray-500">Step {currentStep + 1} of {STEPS.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => saveCampaign(false)}
                  disabled={saving}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Save Draft
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-2 pb-4 overflow-x-auto">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => index < currentStep && setCurrentStep(index)}
                      disabled={index > currentStep}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                        isActive 
                          ? 'bg-purple-100 text-purple-700' 
                          : isCompleted 
                            ? 'bg-green-100 text-green-700 cursor-pointer' 
                            : 'text-gray-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive 
                          ? 'bg-purple-600 text-white' 
                          : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className="font-medium">{step.title}</span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-gray-300 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==========================================
            STEP CONTENT
        ========================================== */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Step 1: Campaign Type */}
          {STEPS[currentStep].id === 'type' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">What type of campaign?</h2>
                <p className="text-gray-500">Choose the type that best fits your goals</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {CAMPAIGN_TYPES.map(type => {
                  const Icon = type.icon;
                  const isSelected = campaign.type === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => updateCampaign('type', type.id)}
                      className={`relative p-6 rounded-2xl border-2 text-left transition ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      {type.badge && (
                        <span className="absolute top-4 right-4 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Crown className="w-3 h-3" /> {type.badge}
                        </span>
                      )}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                        isSelected ? `bg-${type.color}-600` : `bg-${type.color}-100`
                      }`}>
                        <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : `text-${type.color}-600`}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                      <p className="text-sm text-gray-500">{type.description}</p>
                      
                      {isSelected && (
                        <div className="absolute top-4 left-4">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Tip: Start with a regular campaign</h4>
                  <p className="text-sm text-blue-700">It's the easiest way to get started. You can always create automations later.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Campaign Details */}
          {STEPS[currentStep].id === 'details' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Details</h2>
                <p className="text-gray-500">Give your campaign a name and compelling subject line</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                {/* Campaign Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name <span className="text-gray-400">(internal use only)</span>
                  </label>
                  <input
                    type="text"
                    value={campaign.name}
                    onChange={(e) => updateCampaign('name', e.target.value)}
                    placeholder="e.g., January Newsletter, Product Launch"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Subject Line */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Subject Line
                    </label>
                    <button
                      onClick={generateAISubjects}
                      disabled={generatingAI}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    >
                      {generatingAI ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Generate with AI
                    </button>
                  </div>
                  <input
                    type="text"
                    value={campaign.subject}
                    onChange={(e) => updateCampaign('subject', e.target.value)}
                    placeholder="e.g., Don't miss our biggest sale of the year!"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    Use personalization like {"{{first_name}}"} to increase open rates
                  </p>
                  
                  {/* AI Suggestions */}
                  {showAISubject && aiSubjects.length > 0 && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-purple-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> AI Suggestions
                        </h4>
                        <button onClick={() => setShowAISubject(false)} className="text-purple-600 hover:text-purple-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {aiSubjects.map((subject, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              updateCampaign('subject', subject);
                              setShowAISubject(false);
                            }}
                            className="w-full text-left px-3 py-2 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition text-sm"
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview Text <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={campaign.previewText}
                    onChange={(e) => updateCampaign('previewText', e.target.value)}
                    placeholder="This appears after the subject line in the inbox"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Sender */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                    <input
                      type="text"
                      value={campaign.sender.name}
                      onChange={(e) => updateCampaign('sender', { ...campaign.sender, name: e.target.value })}
                      placeholder="Your Name or Company"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                    <select
                      value={campaign.sender.email}
                      onChange={(e) => updateCampaign('sender', { ...campaign.sender, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {senderAddresses.length > 0 ? (
                        senderAddresses.map(addr => (
                          <option key={addr._id} value={addr.email}>{addr.email}</option>
                        ))
                      ) : (
                        <option value="">Add a sender address first</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Email Preview */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" /> Inbox Preview
                </h3>
                <div className="bg-gray-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {campaign.sender.name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{campaign.sender.name || 'Sender Name'}</span>
                        <span className="text-sm text-gray-500">Now</span>
                      </div>
                      <div className="font-medium text-gray-900 truncate">{campaign.subject || 'Your subject line here'}</div>
                      <div className="text-sm text-gray-500 truncate">{campaign.previewText || 'Preview text appears here...'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Select Audience */}
          {STEPS[currentStep].id === 'audience' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Who should receive this?</h2>
                <p className="text-gray-500">Select your target audience</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                {/* All Contacts */}
                <button
                  onClick={() => updateCampaign('audience', { ...campaign.audience, type: 'all' })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    campaign.audience.type === 'all' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        campaign.audience.type === 'all' ? 'bg-purple-600' : 'bg-gray-100'
                      }`}>
                        <Users className={`w-6 h-6 ${campaign.audience.type === 'all' ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">All Subscribed Contacts</h3>
                        <p className="text-sm text-gray-500">Send to everyone in your list</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{contacts.subscribed || 0}</div>
                      <div className="text-sm text-gray-500">contacts</div>
                    </div>
                  </div>
                </button>

                {/* By Tags */}
                <button
                  onClick={() => updateCampaign('audience', { ...campaign.audience, type: 'tags' })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    campaign.audience.type === 'tags' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      campaign.audience.type === 'tags' ? 'bg-purple-600' : 'bg-gray-100'
                    }`}>
                      <Target className={`w-6 h-6 ${campaign.audience.type === 'tags' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">By Tags</h3>
                      <p className="text-sm text-gray-500">Target contacts with specific tags</p>
                    </div>
                  </div>
                </button>

                {/* Segment */}
                <button
                  onClick={() => updateCampaign('audience', { ...campaign.audience, type: 'segment' })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition relative ${
                    campaign.audience.type === 'segment' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Pro
                  </span>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      campaign.audience.type === 'segment' ? 'bg-purple-600' : 'bg-gray-100'
                    }`}>
                      <BarChart3 className={`w-6 h-6 ${campaign.audience.type === 'segment' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Custom Segment</h3>
                      <p className="text-sm text-gray-500">Advanced targeting with conditions</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Estimated Recipients */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Estimated Recipients</h4>
                    <p className="text-sm text-green-700">Based on your selection</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-700">{contacts.subscribed || 0}</div>
              </div>
            </div>
          )}

          {/* Step 4: Content (redirect to editor) */}
          {STEPS[currentStep].id === 'content' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Design Your Email</h2>
                <p className="text-gray-500">Choose how you want to create your email</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Drag & Drop Editor */}
                <button
                  onClick={() => saveCampaign(true)}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-left hover:border-purple-500 hover:shadow-lg transition group"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Layout className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & Drop Editor</h3>
                  <p className="text-gray-500 mb-4">Build beautiful emails visually with our easy-to-use editor</p>
                  <span className="text-purple-600 font-medium flex items-center gap-1">
                    Open Editor <ArrowRight className="w-4 h-4" />
                  </span>
                </button>

                {/* Start from Template */}
                <Link
                  href="/studio/campaigns/templates"
                  className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-left hover:border-purple-500 hover:shadow-lg transition group"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Templates</h3>
                  <p className="text-gray-500 mb-4">Start with one of our 50+ professional templates</p>
                  <span className="text-purple-600 font-medium flex items-center gap-1">
                    View Templates <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          )}

          {/* Step 5: Review & Send */}
          {STEPS[currentStep].id === 'review' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Send</h2>
                <p className="text-gray-500">Make sure everything looks good before sending</p>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Campaign Name</h3>
                    <p className="text-lg font-semibold text-gray-900">{campaign.name || 'Untitled'}</p>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Subject Line</h3>
                    <p className="text-lg font-semibold text-gray-900">{campaign.subject || 'No subject'}</p>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Recipients</h3>
                    <p className="text-lg font-semibold text-gray-900">{contacts.subscribed || 0} contacts</p>
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">From</h3>
                    <p className="text-lg font-semibold text-gray-900">{campaign.sender.name} &lt;{campaign.sender.email}&gt;</p>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>

              {/* Send Options */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">When do you want to send?</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => updateCampaign('schedule', { type: 'immediate' })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      campaign.schedule.type === 'immediate' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Send className="w-6 h-6 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Send Now</h4>
                        <p className="text-sm text-gray-500">Your campaign will be sent immediately</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => updateCampaign('schedule', { type: 'scheduled' })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      campaign.schedule.type === 'scheduled' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Schedule for Later</h4>
                        <p className="text-sm text-gray-500">Pick a date and time</p>
                      </div>
                    </div>
                  </button>

                  {campaign.schedule.type === 'scheduled' && (
                    <div className="pl-14">
                      <input
                        type="datetime-local"
                        value={campaign.schedule.scheduledAt || ''}
                        onChange={(e) => updateCampaign('schedule', { ...campaign.schedule, scheduledAt: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Warning */}
              {!campaign.content?.html && !campaign.content?.blocks?.length && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">No email content</h4>
                    <p className="text-sm text-yellow-700">You haven't designed your email yet. Go back to add content.</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                {campaign.schedule.type === 'immediate' ? (
                  <button
                    onClick={sendCampaign}
                    disabled={saving}
                    className="flex-1 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Send Campaign Now
                  </button>
                ) : (
                  <button
                    onClick={scheduleCampaign}
                    disabled={saving || !campaign.schedule.scheduledAt}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
                    Schedule Campaign
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            BOTTOM NAVIGATION
        ========================================== */}
        {STEPS[currentStep].id !== 'review' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {STEPS[currentStep].id === 'content' ? 'Open Editor' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
