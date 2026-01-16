// ============================================
// FILE: src/pages/studio/email/domains.jsx
// CYBEV Sender Domain Verification UI
// VERSION: 1.0.0 - Custom Email Domain Setup
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Globe, Plus, Check, X, AlertCircle, RefreshCw, Trash2,
  Copy, ExternalLink, Shield, Mail, ChevronDown, ChevronUp,
  Loader2, CheckCircle, Clock, AlertTriangle, ArrowLeft
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function DomainVerification() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchDomains = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sender-domains`, getAuth());
      const data = await res.json();
      if (data.domains) setDomains(data.domains);
    } catch (err) {
      console.error('Fetch domains error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addDomain = async () => {
    if (!newDomain.trim()) return;
    
    setAdding(true);
    try {
      const res = await fetch(`${API_URL}/api/sender-domains`, {
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
      const res = await fetch(`${API_URL}/api/sender-domains/${domainId}/verify`, {
        method: 'POST',
        ...getAuth()
      });
      
      const data = await res.json();
      if (data.ok) {
        setDomains(domains.map(d => d._id === domainId ? data.domain : d));
        alert(data.isFullyVerified 
          ? '🎉 Domain verified! You can now send emails from this domain.'
          : data.message || 'Some DNS records are still propagating.'
        );
      }
    } catch (err) {
      alert('Verification failed');
    } finally {
      setVerifying(null);
    }
  };

  const deleteDomain = async (domainId) => {
    if (!confirm('Delete this domain?')) return;
    try {
      await fetch(`${API_URL}/api/sender-domains/${domainId}`, { method: 'DELETE', ...getAuth() });
      setDomains(domains.filter(d => d._id !== domainId));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
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
      <span className={`flex items-center gap-1 px-2 py-1 ${badge.bg} ${badge.text} text-xs font-medium rounded-full`}>
        <Icon className="w-3 h-3" />{badge.label}
      </span>
    );
  };

  const DnsRecord = ({ type, label, name, value, verified, typeColor }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 ${typeColor} text-xs font-mono rounded`}>{type}</span>
          <span className="font-medium text-gray-900">{label}</span>
        </div>
        {verified ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-gray-400" />}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500 mb-1">Name/Host</div>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-xs flex-1 truncate">{name}</code>
            <button onClick={() => copyToClipboard(name)} className="p-1 hover:bg-gray-100 rounded">
              <Copy className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        <div>
          <div className="text-gray-500 mb-1">Value</div>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-xs flex-1 truncate">{value}</code>
            <button onClick={() => copyToClipboard(value)} className="p-1 hover:bg-gray-100 rounded">
              <Copy className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <Head><title>Domain Verification - CYBEV Email</title></Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio/email" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Email
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Sender Domains</h1>
            <p className="text-gray-600 mt-1">Verify custom domains to send emails from your own addresses</p>
          </div>
          <button onClick={() => setShowAddDomain(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
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

        {/* Add Domain Modal */}
        {showAddDomain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Add Sender Domain</h2>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={newDomain} onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Don't include "www" or "http://"</p>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button onClick={() => { setShowAddDomain(false); setNewDomain(''); }} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addDomain} disabled={adding || !newDomain.trim()} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
                  {adding && <Loader2 className="w-4 h-4 animate-spin" />}Add Domain
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Domains List */}
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
        ) : domains.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No domains yet</h3>
            <p className="text-gray-500 mb-6">Add your first custom sender domain to get started</p>
            <button onClick={() => setShowAddDomain(true)} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Add Your First Domain
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {domains.map(domain => (
              <div key={domain._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedDomain(expandedDomain === domain._id ? null : domain._id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600" />
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
                        <button onClick={(e) => { e.stopPropagation(); verifyDomain(domain._id); }} disabled={verifying === domain._id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50">
                          {verifying === domain._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}Verify DNS
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteDomain(domain._id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">Add these DNS records to your domain's DNS settings.</p>

                    <DnsRecord type="TXT" label="Domain Verification" typeColor="bg-blue-100 text-blue-700"
                      name={domain.verification?.txtRecord?.name || `_amazonses.${domain.domain}`}
                      value={domain.verification?.txtRecord?.value || ''}
                      verified={domain.verification?.txtRecord?.verified} />

                    <DnsRecord type="TXT" label="SPF Record" typeColor="bg-green-100 text-green-700"
                      name={`@ or ${domain.domain}`}
                      value={domain.verification?.spfRecord?.value || 'v=spf1 include:amazonses.com ~all'}
                      verified={domain.verification?.spfRecord?.verified} />

                    {domain.verification?.dkimRecords?.map((dkim, i) => (
                      <DnsRecord key={i} type="CNAME" label={`DKIM ${i + 1}`} typeColor="bg-purple-100 text-purple-700"
                        name={dkim.name} value={dkim.value} verified={dkim.verified} />
                    ))}

                    <DnsRecord type="TXT" label="DMARC (Recommended)" typeColor="bg-orange-100 text-orange-700"
                      name={`_dmarc.${domain.domain}`}
                      value={domain.verification?.dmarcRecord?.value || 'v=DMARC1; p=none;'}
                      verified={domain.verification?.dmarcRecord?.verified} />

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <strong>Tips:</strong> DNS changes can take up to 48 hours. If using Cloudflare, disable proxy (orange cloud) for CNAME records.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
