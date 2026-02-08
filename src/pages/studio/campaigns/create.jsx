// ============================================
// FILE: src/pages/studio/campaigns/create.jsx  
// CYBEV Campaign Creation Wizard - Fully Functional
// VERSION: 5.5.0 - Fixed Send From Editor Flow
// CHANGELOG:
//   5.5.0 - Load campaign from editId, skip to review, fix html in send request
//   5.4.0 - Added beautiful send success modal with stats
//   5.3.0 - Added "Edit Template" button after template selection
//   5.2.0 - Display built-in templates with thumbnails, ratings, usage counts
//   5.1.0 - Pre-select list from query parameter
//   5.0.0 - AI, Tags, Segments, Sender Config
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
  FileText, Wand2, RefreshCw, Copy, Lightbulb, AlertCircle, Crown,
  Tag, Filter, Plus, ChevronDown, Folder, UserCheck, Hash, Trash2,
  Edit3, Save, Play, Pause, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const STEPS = [
  { id: 'type', title: 'Campaign Type', description: 'Choose campaign type', icon: Mail },
  { id: 'details', title: 'Details', description: 'Name, subject, sender', icon: Type },
  { id: 'audience', title: 'Audience', description: 'Select recipients', icon: Users },
  { id: 'content', title: 'Content', description: 'Design email', icon: Layout },
  { id: 'review', title: 'Review', description: 'Send campaign', icon: Send }
];

const CAMPAIGN_TYPES = [
  { id: 'regular', name: 'Regular Campaign', description: 'Send a one-time email', icon: Mail, color: 'purple' },
  { id: 'automated', name: 'Automated Email', description: 'Trigger-based emails', icon: Zap, color: 'blue', pro: true },
  { id: 'ab_test', name: 'A/B Test', description: 'Test different versions', icon: BarChart3, color: 'green', pro: true }
];

const AUDIENCE_TYPES = [
  { id: 'all', name: 'All Subscribed Contacts', description: 'Send to everyone subscribed', icon: Users },
  { id: 'list', name: 'By List', description: 'Target specific lists', icon: Folder },
  { id: 'tags', name: 'By Tags', description: 'Target by tags', icon: Tag },
  { id: 'segment', name: 'Custom Segment', description: 'Advanced targeting', icon: Filter, pro: true }
];

const getAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return { headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' } };
};

export default function CreateCampaign() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [campaign, setCampaign] = useState({
    name: '', type: 'regular', subject: '', previewText: '',
    sender: { name: '', email: '' },
    audienceType: 'all', selectedLists: [], includeTags: [], excludeTags: [],
    segment: { conditions: [], matchType: 'all' },
    content: { type: 'editor', templateId: null, html: '', designJson: null },
    scheduledFor: null
  });

  const [senderAddresses, setSenderAddresses] = useState([]);
  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState({ total: 0, subscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [audienceCount, setAudienceCount] = useState(0);
  const [loadingAudience, setLoadingAudience] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiSubjects, setAiSubjects] = useState([]);
  const [showAISubjects, setShowAISubjects] = useState(false);
  const [aiContent, setAiContent] = useState(null);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [contentPrompt, setContentPrompt] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [showSendSuccess, setShowSendSuccess] = useState(false);
  const [sendResult, setSendResult] = useState({ sent: 0, campaignId: null });
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [addrRes, listRes, tagRes, tmplRes, statRes] = await Promise.all([
          fetch(`${API_URL}/api/campaigns-enhanced/addresses`, getAuth()),
          fetch(`${API_URL}/api/campaigns-enhanced/lists`, getAuth()),
          fetch(`${API_URL}/api/campaigns-enhanced/tags`, getAuth()),
          fetch(`${API_URL}/api/campaigns-enhanced/templates`, getAuth()),
          fetch(`${API_URL}/api/campaigns-enhanced/stats`, getAuth())
        ]);
        
        const [addrData, listData, tagData, tmplData, statData] = await Promise.all([
          addrRes.json(), listRes.json(), tagRes.json(), tmplRes.json(), statRes.json()
        ]);

        if (addrData.addresses) {
          setSenderAddresses(addrData.addresses);
          const def = addrData.addresses.find(a => a.isDefault) || addrData.addresses[0];
          if (def) setCampaign(p => ({ ...p, sender: { name: def.displayName || '', email: def.email } }));
        }
        if (listData.lists) setLists(listData.lists);
        if (tagData.tags) setTags(tagData.tags);
        if (tmplData.templates) setTemplates(tmplData.templates);
        if (statData.contacts) { setStats(statData.contacts); setAudienceCount(statData.contacts.subscribed || 0); }
        
        // Handle pre-selected list from query parameter
        const preselectedList = router.query.list;
        if (preselectedList && listData.lists?.some(l => l._id === preselectedList)) {
          setCampaign(p => ({ ...p, audienceType: 'list', selectedLists: [preselectedList] }));
        }

        // Handle editId - load campaign from editor
        const editId = router.query.editId;
        if (editId) {
          try {
            const campaignRes = await fetch(`${API_URL}/api/campaigns-enhanced/${editId}`, getAuth());
            const campaignData = await campaignRes.json();
            if (campaignData.campaign || campaignData._id) {
              const c = campaignData.campaign || campaignData;
              const htmlContent = c.html || c.content?.html || '';
              setCampaign(p => ({
                ...p,
                _id: c._id,
                name: c.name || p.name,
                subject: c.subject || p.subject,
                previewText: c.previewText || '',
                type: c.type || 'regular',
                html: htmlContent, // Also set at top level for send
                sender: {
                  name: c.fromName || p.sender.name,
                  email: c.fromEmail || p.sender.email
                },
                audienceType: c.audienceType || 'all',
                selectedLists: c.lists || [],
                includeTags: c.includeTags || [],
                excludeTags: c.excludeTags || [],
                content: {
                  type: 'editor',
                  templateId: null,
                  html: htmlContent,
                  designJson: c.designJson || c.content?.json || null
                }
              }));
              // Skip to review step if coming from editor
              setCurrentStep(4); // Review step
              console.log('📧 Loaded campaign from editor:', c.name, 'HTML length:', htmlContent.length);
            }
          } catch (err) {
            console.error('Error loading campaign for editing:', err);
          }
        }
      } catch (err) { console.error('Fetch error:', err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [router.query.list, router.query.editId]);

  const previewAudience = async () => {
    setLoadingAudience(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/segments/preview`, {
        method: 'POST', ...getAuth(),
        body: JSON.stringify({ audienceType: campaign.audienceType, lists: campaign.selectedLists, includeTags: campaign.includeTags, excludeTags: campaign.excludeTags })
      });
      const data = await res.json();
      if (data.count !== undefined) setAudienceCount(data.count);
    } catch (err) { console.error(err); }
    finally { setLoadingAudience(false); }
  };

  useEffect(() => {
    if (campaign.audienceType === 'all') setAudienceCount(stats.subscribed || 0);
    else previewAudience();
  }, [campaign.audienceType, campaign.selectedLists, campaign.includeTags, campaign.excludeTags]);

  const generateAISubjects = async () => {
    if (!campaign.name && !campaign.subject) { alert('Enter campaign name first'); return; }
    setGeneratingAI(true); setShowAISubjects(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/ai/subject-line`, {
        method: 'POST', ...getAuth(),
        body: JSON.stringify({ context: campaign.name || campaign.subject, tone: 'professional' })
      });
      const data = await res.json();
      setAiSubjects(data.suggestions || [
        `🚀 ${campaign.name} - Limited time offer`,
        `Important update: ${campaign.name}`,
        `[Action Required] ${campaign.name}`,
        `You're invited: ${campaign.name}`,
        `Quick question about ${campaign.name}`
      ]);
    } catch { setAiSubjects([`🚀 ${campaign.name} - Don't miss out!`, `Important: ${campaign.name}`]); }
    finally { setGeneratingAI(false); }
  };

  const generateAIContent = async () => {
    if (!contentPrompt.trim()) { alert('Describe your email first'); return; }
    setGeneratingContent(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/ai/email-content`, {
        method: 'POST', ...getAuth(),
        body: JSON.stringify({ prompt: contentPrompt, subject: campaign.subject, tone: 'professional' })
      });
      const data = await res.json();
      if (data.html) { setAiContent(data.html); setCampaign(p => ({ ...p, content: { ...p.content, html: data.html } })); }
    } catch { alert('AI generation failed'); }
    finally { setGeneratingContent(false); }
  };

  const updateCampaign = (field, value) => setCampaign(p => ({ ...p, [field]: value }));

  const saveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced`, { method: 'POST', ...getAuth(), body: JSON.stringify({ ...campaign, status: 'draft' }) });
      const data = await res.json();
      if (data.campaign) { alert('Draft saved!'); router.push('/studio/campaigns'); }
      else alert(data.error || 'Save failed');
    } catch { alert('Save failed'); }
    finally { setSaving(false); }
  };

  const sendTestEmail = async () => {
    if (!testEmail.trim()) { alert('Enter email'); return; }
    setSendingTest(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/test`, {
        method: 'POST', ...getAuth(),
        body: JSON.stringify({ email: testEmail, subject: campaign.subject, html: campaign.content.html, fromEmail: campaign.sender.email, fromName: campaign.sender.name })
      });
      const data = await res.json();
      if (data.ok) { alert(`Test sent to ${testEmail}!`); setShowTestModal(false); setTestEmail(''); }
      else alert(data.error || 'Failed');
    } catch { alert('Failed'); }
    finally { setSendingTest(false); }
  };

  const scheduleCampaign = async () => {
    if (!scheduleDate || !scheduleTime) { alert('Select date/time'); return; }
    const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`);
    if (scheduledFor <= new Date()) { alert('Must be future'); return; }
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced`, { method: 'POST', ...getAuth(), body: JSON.stringify({ ...campaign, status: 'scheduled', scheduledFor: scheduledFor.toISOString() }) });
      const data = await res.json();
      if (data.campaign) { alert(`Scheduled for ${scheduledFor.toLocaleString()}`); router.push('/studio/campaigns'); }
    } catch { alert('Failed'); }
    finally { setSending(false); }
  };

  const sendCampaign = async () => {
    if (!confirm(`Send to ${audienceCount.toLocaleString()} recipients?`)) return;
    setSending(true);
    try {
      // Prepare campaign data with html at top level for backend
      const sendData = {
        ...campaign,
        html: campaign.html || campaign.content?.html || '',
        fromEmail: campaign.sender?.email,
        fromName: campaign.sender?.name
      };
      
      console.log('📤 Sending campaign:', sendData.name, 'HTML length:', sendData.html?.length);
      
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/send`, { method: 'POST', ...getAuth(), body: JSON.stringify(sendData) });
      const data = await res.json();
      console.log('📤 Send response:', data);
      
      if (data.ok) {
        console.log('✅ Campaign sent successfully, showing modal');
        setSendResult({ sent: data.sent || audienceCount, campaignId: data.campaign?._id || data.campaignId });
        setShowSendSuccess(true);
      } else {
        console.error('❌ Send failed:', data.error);
        alert(data.error || 'Failed to send campaign');
      }
    } catch (err) {
      console.error('Send error:', err);
      alert('Failed to send campaign');
    } finally {
      setSending(false);
    }
  };

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case 'type': return !!campaign.type;
      case 'details': return campaign.name && campaign.subject && campaign.sender.email;
      case 'audience': return campaign.audienceType === 'all' || (campaign.audienceType === 'list' && campaign.selectedLists.length > 0) || (campaign.audienceType === 'tags' && campaign.includeTags.length > 0) || true;
      case 'content': return !!campaign.content.html || !!campaign.content.templateId;
      default: return true;
    }
  };

  const nextStep = () => { if (currentStep < STEPS.length - 1 && canProceed()) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const toggleList = (id) => updateCampaign('selectedLists', campaign.selectedLists.includes(id) ? campaign.selectedLists.filter(x => x !== id) : [...campaign.selectedLists, id]);
  const toggleIncludeTag = (t) => updateCampaign('includeTags', campaign.includeTags.includes(t) ? campaign.includeTags.filter(x => x !== t) : [...campaign.includeTags, t]);
  const toggleExcludeTag = (t) => updateCampaign('excludeTags', campaign.excludeTags.includes(t) ? campaign.excludeTags.filter(x => x !== t) : [...campaign.excludeTags, t]);

  if (loading) return <AppLayout><div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-purple-500" /></div></AppLayout>;

  return (
    <AppLayout>
      <Head><title>Create Campaign | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/studio/campaigns" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
              <div><h1 className="text-xl font-bold text-gray-900">Create Campaign</h1><p className="text-sm text-gray-500">Step {currentStep + 1} of {STEPS.length}</p></div>
            </div>
            <button onClick={saveDraft} disabled={saving} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Draft
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button onClick={() => i < currentStep && setCurrentStep(i)} disabled={i > currentStep} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i < currentStep ? 'bg-green-500 text-white' : i === currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                    {i < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="hidden md:block text-sm">{step.title}</span>
                </button>
                {i < STEPS.length - 1 && <div className={`w-8 lg:w-16 h-1 mx-2 ${i < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Step 1: Type */}
          {STEPS[currentStep].id === 'type' && (
            <div className="space-y-6">
              <div className="text-center mb-8"><h2 className="text-2xl font-bold">Choose Campaign Type</h2></div>
              <div className="grid md:grid-cols-3 gap-4">
                {CAMPAIGN_TYPES.map(t => (
                  <button key={t.id} onClick={() => updateCampaign('type', t.id)} disabled={t.pro}
                    className={`relative p-6 rounded-xl border-2 text-left ${campaign.type === t.id ? 'border-purple-500 bg-purple-50' : t.pro ? 'opacity-50' : 'border-gray-200 hover:border-purple-300'}`}>
                    {t.pro && <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs rounded-full flex items-center gap-1"><Crown className="w-3 h-3" />PRO</div>}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${t.color === 'purple' ? 'bg-purple-100 text-purple-600' : t.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}><t.icon className="w-6 h-6" /></div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-gray-500">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {STEPS[currentStep].id === 'details' && (
            <div className="space-y-6">
              <div className="text-center mb-8"><h2 className="text-2xl font-bold">Campaign Details</h2></div>
              <div className="bg-white rounded-2xl border p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign Name</label>
                  <input type="text" value={campaign.name} onChange={e => updateCampaign('name', e.target.value)} placeholder="e.g., January Newsletter" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Subject Line *</label>
                    <button onClick={generateAISubjects} disabled={generatingAI} className="text-sm text-purple-600 flex items-center gap-1">
                      {generatingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generate with AI
                    </button>
                  </div>
                  <input type="text" value={campaign.subject} onChange={e => updateCampaign('subject', e.target.value)} placeholder="Don't miss our biggest sale!" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500" />
                  {showAISubjects && aiSubjects.length > 0 && (
                    <div className="mt-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-purple-600" /><span className="text-sm font-medium text-purple-700">AI Suggestions</span>
                        <button onClick={() => setShowAISubjects(false)} className="ml-auto"><X className="w-4 h-4" /></button>
                      </div>
                      {aiSubjects.map((s, i) => (
                        <button key={i} onClick={() => { updateCampaign('subject', s); setShowAISubjects(false); }} className="w-full text-left px-3 py-2 mb-2 bg-white rounded-lg border hover:border-purple-400 text-sm">{s}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preview Text <span className="text-gray-400">(optional)</span></label>
                  <input type="text" value={campaign.previewText} onChange={e => updateCampaign('previewText', e.target.value)} placeholder="Preview text in inbox" className="w-full px-4 py-3 border rounded-xl" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">From Name *</label>
                    <input type="text" value={campaign.sender.name} onChange={e => updateCampaign('sender', { ...campaign.sender, name: e.target.value })} placeholder="Your Name" className="w-full px-4 py-3 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">From Email *</label>
                    <select value={campaign.sender.email} onChange={e => updateCampaign('sender', { ...campaign.sender, email: e.target.value })} className="w-full px-4 py-3 border rounded-xl bg-white">
                      <option value="">Select sender...</option>
                      {senderAddresses.map(a => <option key={a._id || a.email} value={a.email}>{a.email} {a.isDefault ? '(Default)' : ''}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Audience */}
          {STEPS[currentStep].id === 'audience' && (
            <div className="space-y-6">
              <div className="text-center mb-8"><h2 className="text-2xl font-bold">Select Audience</h2></div>
              <div className="grid md:grid-cols-2 gap-4">
                {AUDIENCE_TYPES.map(t => (
                  <button key={t.id} onClick={() => updateCampaign('audienceType', t.id)} disabled={t.pro}
                    className={`relative p-5 rounded-xl border-2 text-left ${campaign.audienceType === t.id ? 'border-purple-500 bg-purple-50' : t.pro ? 'opacity-50' : 'border-gray-200 hover:border-purple-300'}`}>
                    {t.pro && <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs rounded-full"><Crown className="w-3 h-3 inline" /> PRO</div>}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${campaign.audienceType === t.id ? 'bg-purple-200 text-purple-700' : 'bg-gray-100'}`}><t.icon className="w-5 h-5" /></div>
                      <div><h3 className="font-medium">{t.name}</h3><p className="text-sm text-gray-500">{t.description}</p></div>
                    </div>
                  </button>
                ))}
              </div>

              {campaign.audienceType === 'list' && (
                <div className="bg-white rounded-xl border p-6 mt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Folder className="w-5 h-5 text-purple-500" />Select Lists</h3>
                  {lists.length === 0 ? <p className="text-gray-500">No lists yet. <Link href="/studio/campaigns/contacts" className="text-purple-600">Create one →</Link></p> : (
                    <div className="grid md:grid-cols-2 gap-3">
                      {lists.map(l => (
                        <label key={l._id} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${campaign.selectedLists.includes(l._id) ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'}`}>
                          <input type="checkbox" checked={campaign.selectedLists.includes(l._id)} onChange={() => toggleList(l._id)} className="rounded text-purple-600" />
                          <div><div className="font-medium">{l.name}</div><div className="text-sm text-gray-500">{l.contactCount || 0} contacts</div></div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {campaign.audienceType === 'tags' && (
                <div className="bg-white rounded-xl border p-6 mt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-purple-500" />Select Tags</h3>
                  {tags.length === 0 ? <p className="text-gray-500">No tags found.</p> : (
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Include tags (must have at least one)</label>
                        <div className="flex flex-wrap gap-2">
                          {tags.map(t => (
                            <button key={t} onClick={() => toggleIncludeTag(t)} className={`px-3 py-1.5 rounded-full text-sm ${campaign.includeTags.includes(t) ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                              {campaign.includeTags.includes(t) && <Check className="w-3 h-3 inline mr-1" />}{t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Exclude tags (optional)</label>
                        <div className="flex flex-wrap gap-2">
                          {tags.map(t => (
                            <button key={t} onClick={() => toggleExcludeTag(t)} disabled={campaign.includeTags.includes(t)}
                              className={`px-3 py-1.5 rounded-full text-sm ${campaign.excludeTags.includes(t) ? 'bg-red-500 text-white' : campaign.includeTags.includes(t) ? 'bg-gray-100 opacity-50' : 'bg-gray-100 hover:bg-gray-200'}`}>
                              {campaign.excludeTags.includes(t) && <X className="w-3 h-3 inline mr-1" />}{t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><UserCheck className="w-6 h-6 text-purple-600" /></div>
                    <div><div className="text-sm text-purple-600 font-medium">Estimated Recipients</div>
                      <div className="text-3xl font-bold text-purple-900">{loadingAudience ? <Loader2 className="w-6 h-6 animate-spin" /> : audienceCount.toLocaleString()}</div>
                    </div>
                  </div>
                  <button onClick={previewAudience} className="text-purple-600 text-sm flex items-center gap-1"><RefreshCw className={`w-4 h-4 ${loadingAudience ? 'animate-spin' : ''}`} />Refresh</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Content */}
          {STEPS[currentStep].id === 'content' && (
            <div className="space-y-6">
              <div className="text-center mb-8"><h2 className="text-2xl font-bold">Design Your Email</h2></div>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[{ id: 'editor', name: 'Drag & Drop', icon: Edit3 }, { id: 'template', name: 'Template', icon: Layout }, { id: 'ai', name: 'AI Generate', icon: Sparkles }].map(o => (
                  <button key={o.id} onClick={() => updateCampaign('content', { ...campaign.content, type: o.id })}
                    className={`p-5 rounded-xl border-2 text-left ${campaign.content.type === o.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                    <o.icon className="w-8 h-8 text-purple-600 mb-3" /><h3 className="font-semibold">{o.name}</h3>
                  </button>
                ))}
              </div>

              {campaign.content.type === 'editor' && (
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold">Email Editor</h3>
                    <Link href="/studio/campaigns/editor" className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2"><Edit3 className="w-4 h-4" />Open Editor</Link>
                  </div>
                  {campaign.content.html ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">Content saved</span></div>
                      <div className="p-4 max-h-64 overflow-auto" dangerouslySetInnerHTML={{ __html: campaign.content.html }} />
                    </div>
                  ) : <div className="text-center py-12 border border-dashed rounded-lg text-gray-500"><Layout className="w-12 h-12 mx-auto mb-4 text-gray-300" />No content yet</div>}
                </div>
              )}

              {campaign.content.type === 'template' && (
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold mb-4">Choose a Template</h3>
                  {templates.length === 0 ? <p className="text-gray-500 text-center py-8">Loading templates... <Loader2 className="w-4 h-4 animate-spin inline ml-2" /></p> : (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {templates.map(t => (
                        <button key={t._id} onClick={() => updateCampaign('content', { ...campaign.content, templateId: t._id, html: t.html })}
                          className={`group rounded-xl border-2 text-left overflow-hidden transition-all ${campaign.content.templateId === t._id ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'}`}>
                          <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                            {t.thumbnail ? (
                              <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
                                <Mail className="w-8 h-8 text-purple-300" />
                              </div>
                            )}
                            {t.type === 'system' && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">Pro</span>
                            )}
                            {campaign.content.templateId === t._id && (
                              <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-purple-600 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-gray-900 truncate">{t.name}</h4>
                            <p className="text-xs text-gray-500 capitalize">{t.category || 'General'}</p>
                            {t.rating && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-yellow-500 text-xs">★</span>
                                <span className="text-xs text-gray-500">{t.rating}</span>
                                {t.usageCount && <span className="text-xs text-gray-400 ml-1">• {t.usageCount.toLocaleString()} uses</span>}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Edit Template Button - Shows after selection */}
                  {campaign.content.templateId && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-900">
                              {templates.find(t => t._id === campaign.content.templateId)?.name || 'Template'} selected
                            </p>
                            <p className="text-sm text-purple-600">Customize it to match your brand</p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/studio/campaigns/editor?templateId=${campaign.content.templateId}`)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Template
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {campaign.content.type === 'ai' && (
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
                    <div><h3 className="font-semibold">AI Email Generator</h3><p className="text-sm text-gray-500">Describe and create</p></div>
                  </div>
                  <textarea value={contentPrompt} onChange={e => setContentPrompt(e.target.value)} placeholder="Describe your email..." rows={4} className="w-full px-4 py-3 border rounded-xl mb-4" />
                  <button onClick={generateAIContent} disabled={generatingContent || !contentPrompt.trim()} className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {generatingContent ? <><Loader2 className="w-5 h-5 animate-spin" />Generating...</> : <><Wand2 className="w-5 h-5" />Generate Email</>}
                  </button>
                  {aiContent && (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />AI Generated</div>
                      <div className="p-4 max-h-96 overflow-auto" dangerouslySetInnerHTML={{ __html: aiContent }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {STEPS[currentStep].id === 'review' && (
            <div className="space-y-6">
              <div className="text-center mb-8"><h2 className="text-2xl font-bold">Review & Send</h2></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-purple-500" />Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{campaign.name || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Subject</span><span className="font-medium truncate max-w-[200px]">{campaign.subject || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">From</span><span className="font-medium">{campaign.sender.name} &lt;{campaign.sender.email}&gt;</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-purple-500" />Audience</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Target</span><span className="font-medium capitalize">{campaign.audienceType === 'all' ? 'All Contacts' : campaign.audienceType}</span></div>
                    <div className="pt-3 border-t flex justify-between items-center"><span className="text-gray-500">Recipients</span><span className="text-2xl font-bold text-purple-600">{audienceCount.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="p-4 border-b flex justify-between">
                  <h3 className="font-semibold flex items-center gap-2"><Eye className="w-5 h-5 text-purple-500" />Preview</h3>
                  <button onClick={() => setShowTestModal(true)} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm flex items-center gap-2"><Send className="w-4 h-4" />Send Test</button>
                </div>
                <div className="p-6 bg-gray-50 max-h-96 overflow-auto">
                  {campaign.content.html ? <div className="bg-white rounded-lg shadow-sm p-4" dangerouslySetInnerHTML={{ __html: campaign.content.html }} /> : <p className="text-center text-gray-500">No content</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setShowSchedule(true)} className="px-6 py-3 border rounded-xl flex items-center justify-center gap-2"><Clock className="w-5 h-5" />Schedule</button>
                <button onClick={sendCampaign} disabled={sending || audienceCount === 0} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                  {sending ? <><Loader2 className="w-5 h-5 animate-spin" />Sending...</> : <><Send className="w-5 h-5" />Send Now</>}
                </button>
              </div>

              {audienceCount === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <div><h4 className="font-medium text-amber-800">No recipients</h4><p className="text-sm text-amber-700">Adjust your targeting.</p></div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button onClick={prevStep} disabled={currentStep === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}>
              <ArrowLeft className="w-4 h-4" />Back
            </button>
            {currentStep < STEPS.length - 1 && (
              <button onClick={nextStep} disabled={!canProceed()} className={`flex items-center gap-2 px-6 py-2 rounded-lg ${canProceed() ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-400'}`}>
                Continue<ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Test Modal */}
        {showTestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b flex justify-between"><h3 className="text-lg font-semibold">Send Test Email</h3><button onClick={() => setShowTestModal(false)}><X className="w-5 h-5" /></button></div>
              <div className="p-6">
                <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setShowTestModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={sendTestEmail} disabled={sendingTest} className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
                  {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Send Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showSchedule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b flex justify-between"><h3 className="text-lg font-semibold">Schedule Campaign</h3><button onClick={() => setShowSchedule(false)}><X className="w-5 h-5" /></button></div>
              <div className="p-6 space-y-4">
                <div><label className="text-sm font-medium block mb-2">Date</label><input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border rounded-lg" /></div>
                <div><label className="text-sm font-medium block mb-2">Time</label><input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setShowSchedule(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={scheduleCampaign} disabled={sending} className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Success Modal */}
        {showSendSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md text-center overflow-hidden">
              {/* Success Animation Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Send className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">Campaign Sent! 🎉</h3>
              </div>
              
              <div className="p-8">
                <div className="bg-green-50 rounded-xl p-4 mb-6">
                  <p className="text-3xl font-bold text-green-600">{sendResult.sent.toLocaleString()}</p>
                  <p className="text-green-700">emails sent successfully</p>
                </div>
                
                <p className="text-gray-500 mb-6">
                  Your campaign "<span className="font-medium text-gray-700">{campaign.name}</span>" is now being delivered to your subscribers.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowSendSuccess(false);
                      router.push('/studio/campaigns');
                    }}
                    className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    View Campaign Analytics
                  </button>
                  <button
                    onClick={() => {
                      setShowSendSuccess(false);
                      // Reset for new campaign
                      setCampaign({
                        name: '', type: 'regular', subject: '', previewText: '',
                        sender: { name: '', email: '' },
                        audienceType: 'all', selectedLists: [], includeTags: [], excludeTags: [],
                        segment: { conditions: [], matchType: 'all' },
                        content: { type: 'editor', templateId: null, html: '', designJson: null },
                        scheduledFor: null
                      });
                      setCurrentStep(0);
                    }}
                    className="w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
                  >
                    Create Another Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
