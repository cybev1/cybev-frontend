// ============================================
// FILE: create.jsx
// PATH: cybev-frontend/src/pages/studio/campaigns/create.jsx
// PURPOSE: Create Campaign Wizard
// VERSION: 1.0.0
// GITHUB: https://github.com/cybev1/cybev-frontend
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail, Phone, MessageSquare, Bell, Sparkles, Send, Calendar, Users, Check } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const TYPES = [
  { id: 'email', name: 'Email Campaign', icon: Mail, desc: 'Rich HTML emails' },
  { id: 'sms', name: 'SMS Campaign', icon: Phone, desc: '160 characters' },
  { id: 'whatsapp', name: 'WhatsApp Broadcast', icon: MessageSquare, desc: 'Rich media messages' },
  { id: 'push', name: 'Push Notification', icon: Bell, desc: 'App notifications' }
];

export default function CreateCampaign() {
  const router = useRouter();
  const { type: preselectedType } = router.query;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lists, setLists] = useState([]);

  const [form, setForm] = useState({
    name: '',
    type: preselectedType || 'email',
    subject: '',
    preheader: '',
    content: '',
    ctaText: 'Learn More',
    ctaUrl: '',
    audienceType: 'all',
    listId: '',
    scheduleType: 'now',
    scheduleDate: '',
    scheduleTime: '09:00',
    aiOptimized: false
  });

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => { fetchLists(); }, []);
  useEffect(() => { if (preselectedType) setForm(f => ({ ...f, type: preselectedType })); }, [preselectedType]);

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/campaigns/contacts/lists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setLists(data.lists || []);
    } catch (err) { console.error(err); }
  };

  const generateWithAI = async (field) => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/ai/generate-campaign`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: form.type, field, context: { name: form.name, subject: form.subject } })
      });
      const data = await res.json();
      if (data.ok && data.generated) {
        setForm(f => ({ ...f, [field]: data.generated }));
      }
    } catch (err) { console.error(err); }
    finally { setGenerating(false); }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.content) {
      alert('Please fill in campaign name and content');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const body = {
        name: form.name,
        type: form.type,
        content: {
          subject: form.subject,
          preheader: form.preheader,
          body: form.content,
          ctaText: form.ctaText,
          ctaUrl: form.ctaUrl
        },
        audience: { type: form.audienceType, listId: form.listId || undefined },
        schedule: form.scheduleType === 'scheduled' ? {
          sendAt: new Date(`${form.scheduleDate}T${form.scheduleTime}`).toISOString(),
          aiOptimized: form.aiOptimized
        } : undefined
      };

      const res = await fetch(`${API}/api/campaigns`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.ok) {
        if (form.scheduleType === 'now') {
          await fetch(`${API}/api/campaigns/${data.campaign._id}/send`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        router.push('/studio/campaigns');
      } else {
        alert(data.error || 'Failed to create campaign');
      }
    } catch (err) { alert('Failed to create campaign'); }
    finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <Head><title>Create Campaign | CYBEV</title></Head>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create Campaign</h1>
            <p className="text-sm text-gray-500">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>

        {/* Step 1: Type & Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Campaign Type</label>
              <div className="grid grid-cols-2 gap-3">
                {TYPES.map(t => (
                  <button key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id }))}
                    className={`p-4 rounded-xl border-2 text-left transition ${form.type === t.id
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}>
                    <t.icon className={`w-6 h-6 mb-2 ${form.type === t.id ? 'text-purple-600' : 'text-gray-400'}`} />
                    <p className="font-medium text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Campaign Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g., January Newsletter"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
            </div>
          </div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <div className="space-y-6">
            {form.type === 'email' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject Line</label>
                    <button onClick={() => generateWithAI('subject')} disabled={generating}
                      className="flex items-center gap-1 text-purple-600 text-sm hover:underline disabled:opacity-50">
                      <Sparkles className="w-4 h-4" /> {generating ? 'Generating...' : 'AI Generate'}
                    </button>
                  </div>
                  <input type="text" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Enter subject line"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preheader (optional)</label>
                  <input type="text" value={form.preheader} onChange={(e) => setForm(f => ({ ...f, preheader: e.target.value }))}
                    placeholder="Preview text shown after subject"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
                </div>
              </>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                <button onClick={() => generateWithAI('content')} disabled={generating}
                  className="flex items-center gap-1 text-purple-600 text-sm hover:underline disabled:opacity-50">
                  <Sparkles className="w-4 h-4" /> {generating ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Write your message..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
              {form.type === 'sms' && (
                <p className="text-sm text-gray-500 mt-1">{form.content.length}/160 characters</p>
              )}
            </div>

            {form.type === 'email' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CTA Button Text</label>
                  <input type="text" value={form.ctaText} onChange={(e) => setForm(f => ({ ...f, ctaText: e.target.value }))}
                    placeholder="Learn More"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CTA URL</label>
                  <input type="url" value={form.ctaUrl} onChange={(e) => setForm(f => ({ ...f, ctaUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Audience */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Audience</label>
              <div className="space-y-3">
                <button onClick={() => setForm(f => ({ ...f, audienceType: 'all' }))}
                  className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 ${form.audienceType === 'all'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'}`}>
                  <Users className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">All Contacts</p>
                    <p className="text-sm text-gray-500">Send to everyone in your contact list</p>
                  </div>
                  {form.audienceType === 'all' && <Check className="w-5 h-5 text-purple-600 ml-auto" />}
                </button>

                <button onClick={() => setForm(f => ({ ...f, audienceType: 'list' }))}
                  className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 ${form.audienceType === 'list'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'}`}>
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Specific List</p>
                    <p className="text-sm text-gray-500">Choose a contact list</p>
                  </div>
                  {form.audienceType === 'list' && <Check className="w-5 h-5 text-purple-600 ml-auto" />}
                </button>
              </div>
            </div>

            {form.audienceType === 'list' && lists.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select List</label>
                <select value={form.listId} onChange={(e) => setForm(f => ({ ...f, listId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <option value="">Choose a list...</option>
                  {lists.map(list => (
                    <option key={list._id} value={list._id}>{list.name} ({list.contactCount} contacts)</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Schedule */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">When to Send</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setForm(f => ({ ...f, scheduleType: 'now' }))}
                  className={`p-4 rounded-xl border-2 text-center ${form.scheduleType === 'now'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'}`}>
                  <Send className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="font-medium">Send Now</p>
                </button>
                <button onClick={() => setForm(f => ({ ...f, scheduleType: 'scheduled' }))}
                  className={`p-4 rounded-xl border-2 text-center ${form.scheduleType === 'scheduled'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'}`}>
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Schedule</p>
                </button>
              </div>
            </div>

            {form.scheduleType === 'scheduled' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                    <input type="date" value={form.scheduleDate} onChange={(e) => setForm(f => ({ ...f, scheduleDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                    <input type="time" value={form.scheduleTime} onChange={(e) => setForm(f => ({ ...f, scheduleTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={form.aiOptimized} onChange={(e) => setForm(f => ({ ...f, aiOptimized: e.target.checked }))}
                    className="w-5 h-5 accent-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" /> AI Send Time Optimization
                    </p>
                    <p className="text-sm text-gray-500">Let AI pick the best time based on audience behavior</p>
                  </div>
                </label>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-medium">
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !form.name}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50">
              Next <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50">
              {loading ? 'Creating...' : form.scheduleType === 'now' ? 'Send Campaign' : 'Schedule Campaign'}
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
