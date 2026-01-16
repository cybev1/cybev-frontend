// ============================================
// FILE: pages/studio/campaigns/editor.jsx
// CYBEV Campaign Editor with Drag-Drop Builder
// VERSION: 2.0.0 - Phase 6
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Send, Clock, Users, Save, Settings, ChevronDown,
  Calendar, Eye, TestTube, Sparkles, AlertCircle, CheckCircle,
  Mail, Target, Zap
} from 'lucide-react';
import api from '@/lib/api';
import EmailEditor, { EMAIL_TEMPLATES } from '@/components/Email/EmailEditor';

export default function CampaignEditor() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [campaign, setCampaign] = useState({
    name: 'Untitled Campaign',
    subject: '',
    preheader: '',
    fromName: '',
    fromEmail: '',
    replyTo: '',
    audienceType: 'all',
    audienceFilter: '',
    status: 'draft'
  });
  const [blocks, setBlocks] = useState([]);
  const [html, setHtml] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAudience, setShowAudience] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [sendType, setSendType] = useState('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [contacts, setContacts] = useState({ total: 0, tags: [] });
  const [senderDomains, setSenderDomains] = useState([]);
  const [emailAddresses, setEmailAddresses] = useState([]);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (id && id !== 'new') {
      loadCampaign(id);
    }
    loadContacts();
    loadSenderDomains();
    loadEmailAddresses();
  }, [id]);
  
  const loadCampaign = async (campaignId) => {
    try {
      setLoading(true);
      const res = await api.get(`/campaigns-enhanced/${campaignId}`);
      if (res.data?.campaign) {
        const c = res.data.campaign;
        setCampaign({
          name: c.name || 'Untitled Campaign',
          subject: c.subject || '',
          preheader: c.preheader || '',
          fromName: c.fromName || '',
          fromEmail: c.fromEmail || '',
          replyTo: c.replyTo || '',
          audienceType: c.audienceType || 'all',
          audienceFilter: c.audienceFilter || '',
          status: c.status || 'draft'
        });
        if (c.content?.blocks) setBlocks(c.content.blocks);
        if (c.content?.html) setHtml(c.content.html);
        if (c.scheduledAt) {
          setSendType('scheduled');
          const d = new Date(c.scheduledAt);
          setScheduleDate(d.toISOString().split('T')[0]);
          setScheduleTime(d.toTimeString().slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Load campaign error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadContacts = async () => {
    try {
      const res = await api.get('/contacts/stats');
      if (res.data) {
        setContacts({ total: res.data.total || 0, tags: res.data.tags || [] });
      }
    } catch (error) {
      console.error('Load contacts error:', error);
    }
  };
  
  const loadSenderDomains = async () => {
    try {
      const res = await api.get('/sender-domains');
      if (res.data?.domains) {
        setSenderDomains(res.data.domains.filter(d => d.status === 'verified'));
      }
    } catch (error) {
      console.error('Load sender domains error:', error);
    }
  };
  
  const loadEmailAddresses = async () => {
    try {
      const res = await api.get('/email/addresses');
      if (res.data?.addresses) {
        setEmailAddresses(res.data.addresses.filter(a => a.isActive));
      }
    } catch (error) {
      console.error('Load email addresses error:', error);
    }
  };
  
  const validateCampaign = () => {
    const newErrors = {};
    if (!campaign.subject?.trim()) newErrors.subject = 'Subject line is required';
    if (!campaign.fromName?.trim()) newErrors.fromName = 'From name is required';
    if (!campaign.fromEmail?.trim()) newErrors.fromEmail = 'From email is required';
    if (blocks.length === 0) newErrors.content = 'Add at least one block to your email';
    if (sendType === 'scheduled' && !scheduleDate) newErrors.schedule = 'Select a date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async (newBlocks, newHtml) => {
    try {
      setSaving(true);
      setBlocks(newBlocks || blocks);
      setHtml(newHtml || html);
      
      const payload = {
        name: campaign.name,
        subject: campaign.subject,
        preheader: campaign.preheader,
        fromName: campaign.fromName,
        fromEmail: campaign.fromEmail,
        replyTo: campaign.replyTo || campaign.fromEmail,
        audienceType: campaign.audienceType,
        audienceFilter: campaign.audienceFilter,
        content: { blocks: newBlocks || blocks, html: newHtml || html },
        status: 'draft'
      };
      
      let res;
      if (id && id !== 'new') {
        res = await api.put(`/campaigns-enhanced/${id}`, payload);
      } else {
        res = await api.post('/campaigns-enhanced', payload);
        if (res.data?.campaign?._id) {
          router.replace(`/studio/campaigns/editor?id=${res.data.campaign._id}`, undefined, { shallow: true });
        }
      }
      
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success('Campaign saved!');
      }
    } catch (error) {
      console.error('Save error:', error);
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Failed to save campaign');
      }
    } finally {
      setSaving(false);
    }
  };
  
  const handleSendTest = async () => {
    if (!testEmail) {
      setErrors({ ...errors, testEmail: 'Enter an email address' });
      return;
    }
    try {
      setSendingTest(true);
      await api.post(`/campaigns-enhanced/${id}/test`, {
        email: testEmail,
        subject: campaign.subject || 'Test Email',
        html: html
      });
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success(`Test email sent to ${testEmail}`);
      }
      setTestEmail('');
    } catch (error) {
      console.error('Send test error:', error);
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Failed to send test email');
      }
    } finally {
      setSendingTest(false);
    }
  };
  
  const handleSend = async () => {
    if (!validateCampaign()) {
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Please fix the errors before sending');
      }
      return;
    }
    
    const confirmed = window.confirm(
      sendType === 'now' 
        ? `Send this campaign to ${contacts.total} contacts now?`
        : `Schedule this campaign for ${scheduleDate} at ${scheduleTime}?`
    );
    if (!confirmed) return;
    
    try {
      setSending(true);
      await handleSave(blocks, html);
      
      const payload = {
        sendType,
        ...(sendType === 'scheduled' && {
          scheduledAt: new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
        })
      };
      
      await api.post(`/campaigns-enhanced/${id}/send`, payload);
      
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success(sendType === 'now' ? 'Campaign is being sent!' : 'Campaign scheduled!');
      }
      router.push('/studio/campaigns');
    } catch (error) {
      console.error('Send error:', error);
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Failed to send campaign');
      }
    } finally {
      setSending(false);
    }
  };
  
  const applyTemplate = (templateName) => {
    const template = EMAIL_TEMPLATES[templateName];
    if (template) {
      setBlocks(template.map((b, i) => ({ ...b, id: `template_${i}_${Date.now()}` })));
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{campaign.name} - Email Editor | CYBEV</title>
      </Head>
      
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/studio/campaigns" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
              className="text-lg font-semibold bg-transparent border-none focus:ring-0 focus:outline-none"
              placeholder="Campaign Name"
            />
            
            <span className={`px-2 py-1 text-xs rounded-full ${
              campaign.status === 'draft' ? 'bg-gray-100 text-gray-600' :
              campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
              campaign.status === 'sent' ? 'bg-green-100 text-green-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {campaign.status}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                showSettings ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
              {(errors.subject || errors.fromName || errors.fromEmail) && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </button>
            
            <button
              onClick={() => setShowAudience(!showAudience)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                showAudience ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{contacts.total} contacts</span>
            </button>
            
            <button
              onClick={() => handleSave(blocks, html)}
              disabled={saving}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showSchedule && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">Send Campaign</h3>
                    
                    <div className="space-y-3 mb-4">
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="sendType"
                          value="now"
                          checked={sendType === 'now'}
                          onChange={() => setSendType('now')}
                          className="text-purple-600"
                        />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Send Now
                          </div>
                          <div className="text-sm text-gray-500">Send immediately</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="sendType"
                          value="scheduled"
                          checked={sendType === 'scheduled'}
                          onChange={() => setSendType('scheduled')}
                          className="text-purple-600"
                        />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Schedule
                          </div>
                          <div className="text-sm text-gray-500">Choose date & time</div>
                        </div>
                      </label>
                    </div>
                    
                    {sendType === 'scheduled' && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="text-sm text-gray-600">Date</label>
                          <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="mt-1 w-full rounded-lg border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Time</label>
                          <input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300"
                          />
                        </div>
                      </div>
                    )}
                    
                    {errors.schedule && (
                      <p className="text-red-500 text-sm mb-3">{errors.schedule}</p>
                    )}
                    
                    <div className="border-t pt-4 mb-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <TestTube className="w-4 h-4" />
                        Send Test Email
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="flex-1 rounded-lg border-gray-300 text-sm"
                        />
                        <button
                          onClick={handleSendTest}
                          disabled={sendingTest || !id}
                          className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm disabled:opacity-50"
                        >
                          {sendingTest ? '...' : 'Send'}
                        </button>
                      </div>
                      {!id && (
                        <p className="text-xs text-gray-500 mt-1">Save campaign first</p>
                      )}
                    </div>
                    
                    <button
                      onClick={handleSend}
                      disabled={sending}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {sendType === 'now' ? 'Send Now' : 'Schedule'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white border-b px-6 py-4">
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line *</label>
                <input
                  type="text"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  className={`w-full rounded-lg ${errors.subject ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Your email subject..."
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
                <input
                  type="text"
                  value={campaign.preheader}
                  onChange={(e) => setCampaign({ ...campaign, preheader: e.target.value })}
                  className="w-full rounded-lg border-gray-300"
                  placeholder="Preview text..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Name *</label>
                <input
                  type="text"
                  value={campaign.fromName}
                  onChange={(e) => setCampaign({ ...campaign, fromName: e.target.value })}
                  className={`w-full rounded-lg ${errors.fromName ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Your Name"
                />
                {errors.fromName && <p className="text-red-500 text-xs mt-1">{errors.fromName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Email *</label>
                <select
                  value={campaign.fromEmail}
                  onChange={(e) => setCampaign({ ...campaign, fromEmail: e.target.value })}
                  className={`w-full rounded-lg ${errors.fromEmail ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <option value="">Select email...</option>
                  {emailAddresses.map(addr => (
                    <option key={addr._id} value={addr.email}>{addr.email}</option>
                  ))}
                  {senderDomains.map(domain => (
                    <option key={domain._id} value={`noreply@${domain.domain}`}>
                      noreply@{domain.domain}
                    </option>
                  ))}
                </select>
                {errors.fromEmail && <p className="text-red-500 text-xs mt-1">{errors.fromEmail}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reply-To</label>
                <input
                  type="email"
                  value={campaign.replyTo}
                  onChange={(e) => setCampaign({ ...campaign, replyTo: e.target.value })}
                  className="w-full rounded-lg border-gray-300"
                  placeholder="replies@domain.com"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Audience Panel */}
        {showAudience && (
          <div className="bg-white border-b px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Select Audience
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {['all', 'tag', 'segment', 'manual'].map(type => (
                  <label key={type} className={`p-4 border rounded-lg cursor-pointer ${
                    campaign.audienceType === type ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="audience"
                      value={type}
                      checked={campaign.audienceType === type}
                      onChange={() => setCampaign({ ...campaign, audienceType: type, audienceFilter: '' })}
                      className="sr-only"
                    />
                    <div className="font-medium capitalize">
                      {type === 'all' ? 'All Contacts' : type}
                    </div>
                    <div className="text-sm text-gray-500">
                      {type === 'all' && `${contacts.total} contacts`}
                      {type === 'tag' && 'Filter by tags'}
                      {type === 'segment' && 'Advanced filters'}
                      {type === 'manual' && 'Select individually'}
                    </div>
                  </label>
                ))}
              </div>
              
              {campaign.audienceType === 'tag' && contacts.tags?.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Tag</label>
                  <select
                    value={campaign.audienceFilter}
                    onChange={(e) => setCampaign({ ...campaign, audienceFilter: e.target.value })}
                    className="w-64 rounded-lg border-gray-300"
                  >
                    <option value="">All tags...</option>
                    {contacts.tags.map(tag => (
                      <option key={tag.name} value={tag.name}>{tag.name} ({tag.count})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Template Selector */}
        {blocks.length === 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Start with a Template
              </h3>
              <div className="flex gap-4">
                {[
                  { name: 'welcome', label: 'Welcome', desc: 'New subscriber', color: 'purple' },
                  { name: 'newsletter', label: 'Newsletter', desc: 'Weekly updates', color: 'blue' },
                  { name: 'promotional', label: 'Promotional', desc: 'Sales & offers', color: 'red' }
                ].map(t => (
                  <button
                    key={t.name}
                    onClick={() => applyTemplate(t.name)}
                    className="px-4 py-3 bg-white border rounded-lg hover:border-purple-400 hover:shadow-md transition-all"
                  >
                    <Mail className={`w-6 h-6 text-${t.color}-600 mb-1`} />
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-gray-500">{t.desc}</div>
                  </button>
                ))}
                <button className="px-4 py-3 bg-white border border-dashed rounded-lg hover:border-purple-400">
                  <div className="w-6 h-6 text-gray-400 mb-1 flex items-center justify-center">+</div>
                  <div className="font-medium text-gray-600">Blank</div>
                  <div className="text-xs text-gray-500">Start fresh</div>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {errors.content && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3">
            <div className="max-w-4xl mx-auto flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              {errors.content}
            </div>
          </div>
        )}
        
        {/* Email Editor */}
        <div className="flex-1 overflow-hidden">
          <EmailEditor
            initialBlocks={blocks}
            onChange={(newBlocks) => setBlocks(newBlocks)}
            onSave={handleSave}
            emailSettings={{ backgroundColor: '#f3f4f6', contentWidth: '600px' }}
          />
        </div>
      </div>
    </>
  );
}

CampaignEditor.getLayout = (page) => page;
