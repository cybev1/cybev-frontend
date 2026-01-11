// ============================================
// FILE: src/pages/studio/campaigns/create.jsx
// PURPOSE: Create Campaign with AI Assistance
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Mail, MessageSquare, Bell, Smartphone, Send, ArrowLeft,
  Users, Target, Zap, Clock, Sparkles, Bot, Image as ImageIcon,
  Link as LinkIcon, Calendar, ChevronRight, ChevronDown, Check,
  Plus, X, Eye, FileText, Wand2, RefreshCw, AlertCircle
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const CAMPAIGN_TYPES = [
  { id: 'email', name: 'Email Campaign', icon: Mail, color: 'blue' },
  { id: 'sms', name: 'SMS Campaign', icon: Smartphone, color: 'green' },
  { id: 'whatsapp', name: 'WhatsApp Broadcast', icon: MessageSquare, color: 'emerald' },
  { id: 'push', name: 'Push Notification', icon: Bell, color: 'purple' }
];

export default function CreateCampaign() {
  const router = useRouter();
  const { type: queryType } = router.query;
  
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState(queryType || '');
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preheader: '',
    content: '',
    ctaText: '',
    ctaUrl: '',
    media: [],
    audienceType: 'all',
    audienceId: '',
    scheduleType: 'now',
    scheduleDate: '',
    scheduleTime: '',
    aiOptimize: true
  });
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchAudiences();
  }, []);

  useEffect(() => {
    if (queryType) setCampaignType(queryType);
  }, [queryType]);

  const fetchAudiences = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/contacts/lists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setAudiences(data.lists || []);
    } catch (err) {
      console.error('Error fetching audiences:', err);
    }
  };

  const generateWithAI = async (field) => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/ai/generate-campaign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: campaignType,
          field,
          context: {
            name: formData.name,
            subject: formData.subject,
            content: formData.content
          }
        })
      });
      
      const data = await res.json();
      if (data.ok && data.generated) {
        setFormData(prev => ({
          ...prev,
          [field]: data.generated
        }));
      }
    } catch (err) {
      console.error('AI generation error:', err);
      alert('Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      let scheduleData = null;
      if (formData.scheduleType === 'scheduled' && formData.scheduleDate) {
        scheduleData = {
          sendAt: new Date(`${formData.scheduleDate}T${formData.scheduleTime || '09:00'}`).toISOString(),
          aiOptimized: formData.aiOptimize
        };
      }

      const res = await fetch(`${API}/api/campaigns`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          type: campaignType,
          content: {
            subject: formData.subject,
            preheader: formData.preheader,
            body: formData.content,
            ctaText: formData.ctaText,
            ctaUrl: formData.ctaUrl,
            media: formData.media
          },
          audience: {
            type: formData.audienceType,
            listId: formData.audienceId
          },
          schedule: scheduleData,
          status: formData.scheduleType === 'now' ? 'sending' : 'scheduled'
        })
      });

      const data = await res.json();
      if (data.ok) {
        router.push(`/studio/campaigns/${data.campaign._id}`);
      } else {
        alert(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      console.error('Create campaign error:', err);
      alert('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Choose Campaign Type
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {CAMPAIGN_TYPES.map(type => {
                  const isSelected = campaignType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setCampaignType(type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                      }`}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{type.name}</h3>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., January Newsletter"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!campaignType || !formData.name}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create Your Content
            </h2>

            {/* Subject Line (for email) */}
            {campaignType === 'email' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject Line
                  </label>
                  <button
                    onClick={() => generateWithAI('subject')}
                    disabled={generating}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    {generating ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Write a compelling subject line"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                />
              </div>
            )}

            {/* Preheader (for email) */}
            {campaignType === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview Text <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.preheader}
                  onChange={(e) => setFormData(prev => ({ ...prev, preheader: e.target.value }))}
                  placeholder="Text that appears after subject in inbox"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                />
              </div>
            )}

            {/* Main Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {campaignType === 'email' ? 'Email Body' : 'Message'}
                </label>
                <button
                  onClick={() => generateWithAI('content')}
                  disabled={generating}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  {generating ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder={campaignType === 'sms' ? 'Keep it under 160 characters for best delivery' : 'Write your message here...'}
                rows={campaignType === 'sms' ? 3 : 8}
                maxLength={campaignType === 'sms' ? 160 : undefined}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
              />
              {campaignType === 'sms' && (
                <p className="text-xs text-gray-500 mt-1">
                  {formData.content.length}/160 characters
                </p>
              )}
            </div>

            {/* CTA Button (for email) */}
            {campaignType === 'email' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                    placeholder="e.g., Learn More"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Button Link
                  </label>
                  <input
                    type="url"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.content}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Your Audience
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                  formData.audienceType === 'all'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="audience"
                  checked={formData.audienceType === 'all'}
                  onChange={() => setFormData(prev => ({ ...prev, audienceType: 'all', audienceId: '' }))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.audienceType === 'all' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                }`}>
                  {formData.audienceType === 'all' && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">All Contacts</p>
                  <p className="text-sm text-gray-500">Send to everyone in your list</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                  formData.audienceType === 'segment'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="audience"
                  checked={formData.audienceType === 'segment'}
                  onChange={() => setFormData(prev => ({ ...prev, audienceType: 'segment' }))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.audienceType === 'segment' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                }`}>
                  {formData.audienceType === 'segment' && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Specific List</p>
                  <p className="text-sm text-gray-500">Target a specific audience segment</p>
                </div>
              </label>
            </div>

            {formData.audienceType === 'segment' && (
              <select
                value={formData.audienceId}
                onChange={(e) => setFormData(prev => ({ ...prev, audienceId: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
              >
                <option value="">Select a list...</option>
                {audiences.map(audience => (
                  <option key={audience._id} value={audience._id}>
                    {audience.name} ({audience.contactCount || 0} contacts)
                  </option>
                ))}
              </select>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Schedule & Send
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                  formData.scheduleType === 'now'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="schedule"
                  checked={formData.scheduleType === 'now'}
                  onChange={() => setFormData(prev => ({ ...prev, scheduleType: 'now' }))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.scheduleType === 'now' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                }`}>
                  {formData.scheduleType === 'now' && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Send Now</p>
                    <p className="text-sm text-gray-500">Start sending immediately</p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                  formData.scheduleType === 'scheduled'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="schedule"
                  checked={formData.scheduleType === 'scheduled'}
                  onChange={() => setFormData(prev => ({ ...prev, scheduleType: 'scheduled' }))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.scheduleType === 'scheduled' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                }`}>
                  {formData.scheduleType === 'scheduled' && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Schedule</p>
                    <p className="text-sm text-gray-500">Choose when to send</p>
                  </div>
                </div>
              </label>
            </div>

            {formData.scheduleType === 'scheduled' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduleDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            )}

            {/* AI Optimization */}
            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">AI Send Time Optimization</p>
                  <p className="text-sm text-gray-500">Send when recipients are most likely to engage</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, aiOptimize: !prev.aiOptimize }))}
                className={`w-12 h-6 rounded-full transition ${
                  formData.aiOptimize ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.aiOptimize ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || (formData.scheduleType === 'scheduled' && !formData.scheduleDate)}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {formData.scheduleType === 'now' ? 'Send Campaign' : 'Schedule Campaign'}
                  </>
                )}
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Create Campaign | CYBEV Studio</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Create Campaign
            </h1>
            <p className="text-sm text-gray-500">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${
                s <= step ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          {renderStep()}
        </div>
      </div>
    </AppLayout>
  );
}
