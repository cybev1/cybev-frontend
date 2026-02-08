// ============================================
// FILE: src/pages/studio/email/domains.jsx
// CYBEV Sender Domain Verification UI
// VERSION: 2.0.0 - Brevo Domain Verification
// CHANGELOG:
//   2.0.0 - Updated for Brevo verification (SPF, DKIM from Brevo API)
//   1.0.0 - Initial AWS SES implementation
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Globe, Plus, Check, X, AlertCircle, RefreshCw, Trash2,
  Copy, ExternalLink, Shield, Mail, ChevronDown, ChevronUp,
  Loader2, CheckCircle, Clock, AlertTriangle, ArrowLeft,
  CheckCircle2, Info, Zap
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function DomainVerification() {
  const [domains, setDomains] = useState([]);
  const [brevoSenders, setBrevoSenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [verifying, setVerifying] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchDomains();
    fetchBrevoSenders();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: 'Bearer ' + token } };
  };

  const fetchDomains = async () => {
    try {
      const res = await fetch(API_URL + '/api/sender-domains', getAuth());
      const data = await res.json();
      if (data.domains) setDomains(data.domains);
    } catch (err) {
      console.error('Fetch domains error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrevoSenders = async () => {
    try {
      const res = await fetch(API_URL + '/api/sender-domains/brevo/senders', getAuth());
      const data = await res.json();
      if (data.senders) setBrevoSenders(data.senders);
    } catch (err) {
      console.error('Fetch Brevo senders error:', err);
    }
  };

  const addDomain = async () => {
    if (!newDomain.trim()) return;
    
    setAdding(true);
    try {
      const res = await fetch(API_URL + '/api/sender-domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ domain: newDomain.trim() })
      });
      
      const data = await res.json();
      if (data.ok) {
        setDomains([data.domain, ...domains]);
        setShowAddDomain(false);
        setNewDomain('');
        setExpandedDomain(data.domain._id);
        // Refresh Brevo senders
        fetchBrevoSenders();
      } else {
        alert(data.error || 'Failed to add domain');
      }
    } catch (err) {
      alert('Failed to add domain');
    } finally {
      setAdding(false);
    }
  };

  const verifyDomain = async (domainId) => {
    setVerifying(domainId);
    try {
      const res = await fetch(API_URL + '/api/sender-domains/' + domainId + '/verify', {
        method: 'POST',
        ...getAuth()
      });
      
      const data = await res.json();
      if (data.ok) {
        setDomains(domains.map(function(d) { return d._id === domainId ? data.domain : d; }));
        
        if (data.isFullyVerified) {
          alert('🎉 Domain verified! You can now send emails from this domain.');
        } else {
          // Show which records are still pending
          const pending = [];
          if (!data.verification?.txt?.verified) pending.push('Domain Verification');
          if (!data.verification?.spf?.verified) pending.push('SPF');
          if (!data.verification?.dkim?.verified) pending.push('DKIM');
          
          alert('DNS records still propagating:\n• ' + pending.join('\n• ') + '\n\nThis can take up to 48 hours.');
        }
        
        // Refresh Brevo senders
        fetchBrevoSenders();
      }
    } catch (err) {
      alert('Verification failed');
    } finally {
      setVerifying(null);
    }
  };

  const deleteDomain = async (domainId) => {
    if (!confirm('Delete this domain? You will no longer be able to send emails from this domain.')) return;
    try {
      await fetch(API_URL + '/api/sender-domains/' + domainId, { method: 'DELETE', ...getAuth() });
      setDomains(domains.filter(function(d) { return d._id !== domainId; }));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(function() { setCopied(null); }, 2000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      verified: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
      verifying: { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Verifying' },
      failed: { icon: AlertTriangle, bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
      pending: { icon: Clock, bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pending' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={'flex items-center gap-1 px-2 py-1 ' + badge.bg + ' ' + badge.text + ' text-xs font-medium rounded-full'}>
        <Icon className="w-3 h-3" />{badge.label}
      </span>
    );
  };

  const DnsRecord = ({ type, label, name, value, verified, required }) => {
    const recordId = label + '-' + name;
    const typeColors = {
      TXT: 'bg-blue-100 text-blue-700',
      CNAME: 'bg-purple-100 text-purple-700'
    };
    
    return (
      <div className={'rounded-lg border p-4 mb-3 ' + (verified ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200')}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={'px-2 py-0.5 ' + (typeColors[type] || 'bg-gray-100 text-gray-700') + ' text-xs font-mono font-medium rounded'}>{type}</span>
            <span className="font-medium text-gray-900">{label}</span>
            {!required && <span className="text-xs text-gray-500">(Recommended)</span>}
          </div>
          {verified ? (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" /> Pending
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">Name/Host</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-800 truncate">{name}</code>
              <button 
                onClick={function() { copyToClipboard(name, recordId + '-name'); }} 
                className={'p-2 rounded-lg transition-colors ' + (copied === recordId + '-name' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-500')}
                title="Copy"
              >
                {copied === recordId + '-name' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">Value</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-800 break-all">{value}</code>
              <button 
                onClick={function() { copyToClipboard(value, recordId + '-value'); }} 
                className={'p-2 rounded-lg transition-colors ' + (copied === recordId + '-value' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-500')}
                title="Copy"
              >
                {copied === recordId + '-value' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get verified senders grouped by domain
  const verifiedDomains = brevoSenders.reduce(function(acc, sender) {
    if (sender.active) {
      const domain = sender.email.split('@')[1];
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(sender);
    }
    return acc;
  }, {});

  return (
    <AppLayout>
      <Head><title>Sender Domains - CYBEV Email</title></Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio/campaigns" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Email
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Sender Domains</h1>
            <p className="text-gray-600 mt-1">Verify custom domains to send emails from your own addresses</p>
          </div>
          <button onClick={function() { setShowAddDomain(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm">
            <Plus className="w-5 h-5" />Add Domain
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm"><Shield className="w-6 h-6 text-purple-600" /></div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Why verify your domain?</h3>
              <p className="text-gray-600 text-sm">
                Send emails from addresses like <strong>you@yourdomain.com</strong> instead of the default CYBEV address. 
                This improves deliverability and builds trust with your recipients.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Senders from Brevo */}
        {Object.keys(verifiedDomains).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              Active Senders in Brevo
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {Object.entries(verifiedDomains).map(function([domain, senders]) {
                return (
                  <div key={domain} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{domain}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-6">
                      {senders.map(function(sender) {
                        return (
                          <span key={sender.id} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                            <Mail className="w-3 h-3 text-gray-500" />
                            {sender.name} &lt;{sender.email}&gt;
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Domain Modal */}
        {showAddDomain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Add Sender Domain</h2>
                <p className="text-sm text-gray-500 mt-1">You'll need to add DNS records to verify ownership</p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={newDomain} 
                    onChange={function(e) { setNewDomain(e.target.value); }}
                    onKeyDown={function(e) { if (e.key === 'Enter') addDomain(); }}
                    placeholder="example.com" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Don't include "www" or "http://"</p>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                <button onClick={function() { setShowAddDomain(false); setNewDomain(''); }} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                <button onClick={addDomain} disabled={adding || !newDomain.trim()} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 transition-colors">
                  {adding && <Loader2 className="w-4 h-4 animate-spin" />}Add Domain
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Domains List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Domains</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
        ) : domains.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No domains yet</h3>
            <p className="text-gray-500 mb-6">Add your first custom sender domain to get started</p>
            <button onClick={function() { setShowAddDomain(true); }} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Add Your First Domain
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {domains.map(function(domain) {
              return (
                <div key={domain._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={function() { setExpandedDomain(expandedDomain === domain._id ? null : domain._id); }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={'w-10 h-10 rounded-lg flex items-center justify-center ' + (domain.status === 'verified' ? 'bg-green-100' : 'bg-purple-100')}>
                        <Globe className={'w-5 h-5 ' + (domain.status === 'verified' ? 'text-green-600' : 'text-purple-600')} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{domain.domain}</div>
                        <div className="text-sm text-gray-500">Added {new Date(domain.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(domain.status)}
                      {expandedDomain === domain._id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  {expandedDomain === domain._id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">DNS Records</h4>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={function(e) { e.stopPropagation(); verifyDomain(domain._id); }} 
                            disabled={verifying === domain._id}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                          >
                            {verifying === domain._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            Verify DNS
                          </button>
                          <button 
                            onClick={function(e) { e.stopPropagation(); deleteDomain(domain._id); }} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete domain"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">Add these DNS records to your domain's DNS settings.</p>

                      {/* Domain Verification TXT */}
                      {domain.verification?.txtRecord && (
                        <DnsRecord 
                          type="TXT" 
                          label="Domain Verification" 
                          name={domain.verification.txtRecord.name}
                          value={domain.verification.txtRecord.value}
                          verified={domain.verification.txtRecord.verified}
                          required={true}
                        />
                      )}

                      {/* SPF Record */}
                      {domain.verification?.spfRecord && (
                        <DnsRecord 
                          type="TXT" 
                          label="SPF Record" 
                          name={domain.verification.spfRecord.name || '@ or ' + domain.domain}
                          value={domain.verification.spfRecord.value || 'v=spf1 include:spf.sendinblue.com ~all'}
                          verified={domain.verification.spfRecord.verified}
                          required={true}
                        />
                      )}

                      {/* DKIM Record (single for Brevo) */}
                      {domain.verification?.dkimRecord && (
                        <DnsRecord 
                          type="TXT" 
                          label="DKIM" 
                          name={domain.verification.dkimRecord.name}
                          value={domain.verification.dkimRecord.value}
                          verified={domain.verification.dkimRecord.verified}
                          required={true}
                        />
                      )}

                      {/* Legacy: DKIM Records array (for old AWS format) */}
                      {domain.verification?.dkimRecords?.map(function(dkim, i) {
                        return (
                          <DnsRecord 
                            key={i} 
                            type="CNAME" 
                            label={'DKIM ' + (i + 1)}
                            name={dkim.name} 
                            value={dkim.value} 
                            verified={dkim.verified}
                            required={true}
                          />
                        );
                      })}

                      {/* DMARC Record */}
                      {domain.verification?.dmarcRecord && (
                        <DnsRecord 
                          type="TXT" 
                          label="DMARC (Recommended)" 
                          name={domain.verification.dmarcRecord.name || '_dmarc.' + domain.domain}
                          value={domain.verification.dmarcRecord.value || 'v=DMARC1; p=none; rua=mailto:dmarc@cybev.io'}
                          verified={domain.verification.dmarcRecord.verified}
                          required={false}
                        />
                      )}

                      {/* Tips */}
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Tips:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                              <li>DNS changes can take up to 48 hours to propagate</li>
                              <li>If using Cloudflare, disable proxy (orange cloud) for CNAME records</li>
                              <li>Make sure to copy the record values exactly as shown</li>
                              <li>Your domain must be verified in Brevo to send emails</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Help Link */}
        <div className="mt-8 text-center">
          <a 
            href="https://help.brevo.com/hc/en-us/articles/12163873383826-Authenticate-your-domain-with-Brevo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline text-sm inline-flex items-center gap-1"
          >
            Need help? View Brevo's domain authentication guide <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
