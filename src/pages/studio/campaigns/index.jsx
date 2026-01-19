// ============================================
// FILE: src/pages/studio/campaigns/index.jsx
// CYBEV Email Marketing - Klaviyo Quality
// VERSION: 4.0.0 - Full Featured Dashboard
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Mail, Send, Plus, Edit2, Trash2, Copy, MoreHorizontal, Sparkles,
  BarChart3, Users, Clock, CheckCircle, Loader2, Play, Pause, Target,
  Calendar, TrendingUp, Eye, MousePointer, AlertCircle, Zap, Gift,
  ArrowLeft, ArrowRight, Filter, Search, Download, Upload, Settings,
  Layout, FileText, Globe, Share2, Bell, Star, Award, Rocket, Heart,
  ChevronRight, X, Check, Info, BookOpen, Video, HelpCircle, Crown,
  LineChart, PieChart, Activity, Layers, Wand2, MessageSquare, Bot
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// ==========================================
// ONBOARDING STEPS
// ==========================================

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome to Email Marketing', description: 'Let\'s set up your email campaigns', icon: Rocket },
  { id: 'contacts', title: 'Import Your Contacts', description: 'Add subscribers to start sending', icon: Users },
  { id: 'sender', title: 'Verify Sender Domain', description: 'Improve deliverability with a verified domain', icon: Globe },
  { id: 'template', title: 'Choose a Template', description: 'Start with a professional design', icon: Layout },
  { id: 'campaign', title: 'Create Your First Campaign', description: 'Send your first email', icon: Send },
];

// ==========================================
// FEATURE CARDS
// ==========================================

const FEATURES = [
  { id: 'campaigns', title: 'Email Campaigns', description: 'Create beautiful emails with our drag-and-drop builder', icon: Mail, color: 'purple', link: '/studio/campaigns/create' },
  { id: 'automation', title: 'Automation', description: 'Set up welcome series, abandoned cart, and more', icon: Zap, color: 'blue', link: '/studio/campaigns/automation', badge: 'Pro' },
  { id: 'templates', title: 'Templates', description: '50+ professional templates ready to customize', icon: Layout, color: 'green', link: '/studio/campaigns/templates' },
  { id: 'segments', title: 'Segments', description: 'Target the right audience with smart filtering', icon: Target, color: 'orange', link: '/studio/campaigns/segments', badge: 'Pro' },
  { id: 'analytics', title: 'Analytics', description: 'Track opens, clicks, and revenue', icon: BarChart3, color: 'pink', link: '/studio/campaigns/analytics' },
  { id: 'forms', title: 'Sign-up Forms', description: 'Grow your list with embedded forms', icon: FileText, color: 'indigo', link: '/studio/forms' },
];

// ==========================================
// AI SUGGESTIONS
// ==========================================

const AI_SUGGESTIONS = [
  { id: 1, title: 'Best time to send', suggestion: 'Your audience is most active on Tuesdays at 10 AM', icon: Clock, action: 'Schedule campaign' },
  { id: 2, title: 'Subject line tip', suggestion: 'Try adding emojis - they increase open rates by 25%', icon: Sparkles, action: 'Generate subjects' },
  { id: 3, title: 'Grow your list', suggestion: 'Add a pop-up form to capture 3x more subscribers', icon: TrendingUp, action: 'Create form' },
  { id: 4, title: 'Re-engage subscribers', suggestion: '150 contacts haven\'t opened in 30 days', icon: Heart, action: 'Create win-back' },
];

// ==========================================
// QUICK ACTIONS
// ==========================================

const QUICK_ACTIONS = [
  { id: 'campaign', label: 'New Campaign', icon: Mail, color: 'bg-purple-600', link: '/studio/campaigns/create' },
  { id: 'template', label: 'Browse Templates', icon: Layout, color: 'bg-blue-600', link: '/studio/campaigns/templates' },
  { id: 'import', label: 'Import Contacts', icon: Upload, color: 'bg-green-600', link: '/studio/campaigns/contacts?import=true' },
  { id: 'automation', label: 'Create Automation', icon: Zap, color: 'bg-orange-500', link: '/studio/campaigns/automation/new' },
];

export default function CampaignsDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = useState([]);
  
  // AI Assistant
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  
  // Feature tour
  const [showFeatureTour, setShowFeatureTour] = useState(false);

  useEffect(() => {
    fetchData();
    checkOnboardingStatus();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    try {
      const [campaignsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/campaigns-enhanced`, getAuth()),
        fetch(`${API_URL}/api/campaigns-enhanced/stats`, getAuth()),
      ]);

      const campaignsData = await campaignsRes.json();
      const statsData = await statsRes.json();

      if (campaignsData.campaigns) setCampaigns(campaignsData.campaigns);
      if (statsData.stats) setStats(statsData.stats);
      
      // Show onboarding if no campaigns
      if (!campaignsData.campaigns?.length) {
        const hasSeenOnboarding = localStorage.getItem('cybev_email_onboarding_seen');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkOnboardingStatus = () => {
    const completed = JSON.parse(localStorage.getItem('cybev_email_onboarding') || '[]');
    setOnboardingCompleted(completed);
  };

  const completeOnboardingStep = (stepId) => {
    const newCompleted = [...onboardingCompleted, stepId];
    setOnboardingCompleted(newCompleted);
    localStorage.setItem('cybev_email_onboarding', JSON.stringify(newCompleted));
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('cybev_email_onboarding_seen', 'true');
  };

  const sendCampaign = async (id) => {
    if (!confirm('Send this campaign now?')) return;
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/${id}/send`, { method: 'POST', ...getAuth() });
      const data = await res.json();
      if (data.ok) {
        alert(`Campaign sending to ${data.recipientCount} recipients!`);
        fetchData();
      } else {
        alert(data.error || 'Failed to send');
      }
    } catch (err) {
      alert('Failed to send campaign');
    }
  };

  const deleteCampaign = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      await fetch(`${API_URL}/api/campaigns-enhanced/${id}`, { method: 'DELETE', ...getAuth() });
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const duplicateCampaign = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/${id}/duplicate`, { method: 'POST', ...getAuth() });
      const data = await res.json();
      if (data.ok) setCampaigns([data.campaign, ...campaigns]);
    } catch (err) {
      alert('Failed to duplicate');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      sent: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Sent' },
      sending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Loader2, label: 'Sending' },
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Calendar, label: 'Scheduled' },
      paused: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Pause, label: 'Paused' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Edit2, label: 'Draft' }
    };
    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${badge.bg} ${badge.text} text-xs font-medium rounded-full`}>
        <Icon className={`w-3 h-3 ${status === 'sending' ? 'animate-spin' : ''}`} />
        {badge.label}
      </span>
    );
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const completedSteps = onboardingCompleted.length;
  const totalSteps = ONBOARDING_STEPS.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <AppLayout>
      <Head>
        <title>Email Marketing - CYBEV Studio</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* ==========================================
            ONBOARDING MODAL
        ========================================== */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white relative">
                <button onClick={dismissOnboarding} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Mail className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Welcome to Email Marketing! 🎉</h2>
                    <p className="text-purple-100 mt-1">Let's get you set up in just a few steps</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="px-8 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Setup Progress</span>
                  <span className="font-medium text-purple-600">{completedSteps}/{totalSteps} complete</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {/* Steps */}
              <div className="p-6 space-y-3">
                {ONBOARDING_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = onboardingCompleted.includes(step.id);
                  const isCurrent = index === onboardingStep;
                  
                  return (
                    <div
                      key={step.id}
                      onClick={() => !isCompleted && setOnboardingStep(index)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition cursor-pointer ${
                        isCompleted 
                          ? 'bg-green-50 border-green-200' 
                          : isCurrent 
                            ? 'bg-purple-50 border-purple-300' 
                            : 'bg-white border-gray-100 hover:border-purple-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : isCurrent ? 'bg-purple-600' : 'bg-gray-100'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>{step.title}</h3>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                      {!isCompleted && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="px-8 py-6 bg-gray-50 flex items-center justify-between">
                <button onClick={dismissOnboarding} className="text-gray-500 hover:text-gray-700">
                  Skip for now
                </button>
                <button
                  onClick={() => {
                    const currentStep = ONBOARDING_STEPS[onboardingStep];
                    if (currentStep.id === 'contacts') router.push('/studio/campaigns/contacts?import=true');
                    else if (currentStep.id === 'sender') router.push('/studio/email/domains');
                    else if (currentStep.id === 'template') router.push('/studio/campaigns/templates');
                    else if (currentStep.id === 'campaign') router.push('/studio/campaigns/create');
                    else {
                      completeOnboardingStep(currentStep.id);
                      if (onboardingStep < ONBOARDING_STEPS.length - 1) {
                        setOnboardingStep(onboardingStep + 1);
                      }
                    }
                  }}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
                >
                  {onboardingStep === 0 ? 'Get Started' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            AI ASSISTANT PANEL
        ========================================== */}
        {showAIAssistant && (
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-40 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs text-purple-100">Powered by Claude</p>
                </div>
              </div>
              <button onClick={() => setShowAIAssistant(false)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  👋 Hi! I'm your AI email marketing assistant. I can help you:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Write compelling subject lines</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Generate email content</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Suggest best send times</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Analyze campaign performance</li>
                </ul>
              </div>

              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Smart Suggestions
              </h4>
              
              {AI_SUGGESTIONS.map(suggestion => {
                const Icon = suggestion.icon;
                return (
                  <div key={suggestion.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">{suggestion.title}</h5>
                        <p className="text-sm text-gray-500 mt-1">{suggestion.suggestion}</p>
                        <button className="mt-2 text-sm text-purple-600 font-medium hover:text-purple-700">
                          {suggestion.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask me anything about email marketing..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* ==========================================
              HEADER
          ========================================== */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/studio" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Studio
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
              <p className="text-gray-600">Create, automate, and analyze your email campaigns</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAIAssistant(true)}
                className="px-4 py-2 border border-purple-200 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Assistant
              </button>
              <Link
                href="/studio/campaigns/create"
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium shadow-lg shadow-purple-500/25"
              >
                <Plus className="w-5 h-5" />
                Create Campaign
              </Link>
            </div>
          </div>

          {/* ==========================================
              SETUP PROGRESS (if not complete)
          ========================================== */}
          {completedSteps < totalSteps && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Complete Your Setup</h2>
                    <p className="text-purple-100">Finish these steps to unlock all features</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{progressPercent}%</div>
                  <div className="text-purple-200 text-sm">{completedSteps} of {totalSteps} steps</div>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-white transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="flex items-center gap-4">
                {ONBOARDING_STEPS.map((step, i) => {
                  const isCompleted = onboardingCompleted.includes(step.id);
                  return (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-white text-purple-600' : 'bg-white/20'}`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                      </div>
                      <span className={`text-sm ${isCompleted ? 'text-white' : 'text-purple-200'}`}>{step.title}</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setShowOnboarding(true)}
                className="mt-4 px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 inline-flex items-center gap-2"
              >
                Continue Setup <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ==========================================
              QUICK ACTIONS
          ========================================== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  href={action.link}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{action.label}</h3>
                </Link>
              );
            })}
          </div>

          {/* ==========================================
              STATS CARDS
          ========================================== */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Campaigns', value: stats.totalCampaigns || 0, icon: Mail, color: 'purple', trend: null },
              { label: 'Contacts', value: stats.totalContacts?.toLocaleString() || 0, icon: Users, color: 'blue', trend: '+12%' },
              { label: 'Emails Sent', value: stats.totalSent?.toLocaleString() || 0, icon: Send, color: 'green', trend: null },
              { label: 'Avg Open Rate', value: `${stats.avgOpenRate || 0}%`, icon: Eye, color: 'orange', trend: '+3.2%' },
              { label: 'Avg Click Rate', value: `${stats.avgClickRate || 0}%`, icon: MousePointer, color: 'pink', trend: '+1.5%' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                    {stat.trend && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {stat.trend}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* ==========================================
              FEATURES GRID (for new users)
          ========================================== */}
          {campaigns.length === 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Explore Features</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {FEATURES.map(feature => {
                  const Icon = feature.icon;
                  return (
                    <Link
                      key={feature.id}
                      href={feature.link}
                      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition group relative overflow-hidden"
                    >
                      {feature.badge && (
                        <span className="absolute top-4 right-4 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Crown className="w-3 h-3" /> {feature.badge}
                        </span>
                      )}
                      <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                        <Icon className={`w-7 h-7 text-${feature.color}-600`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================
              CAMPAIGNS LIST
          ========================================== */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Filters Header */}
            <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900">Your Campaigns</h2>
                <span className="text-sm text-gray-500">({campaigns.length} total)</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {['all', 'draft', 'scheduled', 'sending', 'sent'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                        filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 w-48"
                  />
                </div>
              </div>
            </div>

            {/* Campaigns Table */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create your first email campaign to start engaging with your audience</p>
                <Link
                  href="/studio/campaigns/create"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Campaign
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipients</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCampaigns.map(campaign => (
                    <tr key={campaign._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(campaign.status)}
                        {campaign.status === 'sending' && campaign.sending?.progress > 0 && (
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-2">
                            <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${campaign.sending.progress}%` }} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-medium">{campaign.stats?.recipientCount?.toLocaleString() || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        {campaign.status === 'sent' ? (
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{campaign.stats?.openRate || 0}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MousePointer className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{campaign.stats?.clickRate || 0}%</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {campaign.status === 'draft' && (
                            <>
                              <button onClick={() => router.push(`/studio/campaigns/editor?id=${campaign._id}`)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Edit">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => sendCampaign(campaign._id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Send">
                                <Send className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {campaign.status === 'sent' && (
                            <Link href={`/studio/campaigns/${campaign._id}/report`} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="View Report">
                              <BarChart3 className="w-4 h-4" />
                            </Link>
                          )}
                          <button onClick={() => duplicateCampaign(campaign._id)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Duplicate">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteCampaign(campaign._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ==========================================
              BOTTOM FEATURE CARDS
          ========================================== */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link href="/studio/campaigns/contacts" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Manage Contacts</h3>
              <p className="text-sm text-gray-500">Import, organize, and segment your contacts</p>
            </Link>
            <Link href="/studio/campaigns/templates" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Layout className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Templates</h3>
              <p className="text-sm text-gray-500">Browse 50+ professional designs</p>
            </Link>
            <Link href="/studio/email/domains" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Sender Domains</h3>
              <p className="text-sm text-gray-500">Verify domains for better deliverability</p>
            </Link>
          </div>

          {/* ==========================================
              HELP SECTION
          ========================================== */}
          <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Need help getting started?</h2>
                <p className="text-gray-300 mb-6 max-w-lg">
                  Check out our guides and tutorials to make the most of your email marketing.
                </p>
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Read Guides
                  </button>
                  <button className="px-4 py-2 border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Watch Tutorials
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <HelpCircle className="w-16 h-16 text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
