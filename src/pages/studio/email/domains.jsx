// ============================================
// FILE: src/pages/studio/email/domains.jsx
// CYBEV Sender Domain Verification UI
// VERSION: 4.0.0 - OAuth DNS Provider Integration
// CHANGELOG:
//   4.0.0 - OAuth connections, one-click DNS setup
//   3.0.0 - Auto DNS detection, propagation checking
//   2.0.0 - Brevo domain verification
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Globe, Plus, Check, X, AlertCircle, RefreshCw, Trash2,
  Copy, ExternalLink, Shield, Mail, ChevronDown, ChevronUp,
  Loader2, CheckCircle, Clock, AlertTriangle, ArrowLeft,
  CheckCircle2, Info, Zap, Wifi, Server, Search, Activity,
  Link2, Unlink, Key, Settings, Sparkles, Play, Eye, EyeOff
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function DomainVerification() {
  const router = useRouter();
  const [domains, setDomains] = useState([]);
  const [brevoSenders, setBrevoSenders] = useState([]);
  const [connections, setConnections] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [showConnectProvider, setShowConnectProvider] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [apiCredentials, setApiCredentials] = useState({});
  const [showSecrets, setShowSecrets] = useState({});
  const [connecting, setConnecting] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [verifying, setVerifying] = useState(null);
  const [checkingPropagation, setCheckingPropagation] = useState(null);
  const [autoSetupProgress, setAutoSetupProgress] = useState(null);
  const [propagationResults, setPropagationResults] = useState({});
  const [copied, setCopied] = useState(null);

  useEffect(function() {
    fetchAll();
    
    // Check for OAuth callback
    if (router.query.connected) {
      alert('✅ Successfully connected ' + router.query.connected + '!');
      router.replace('/studio/email/domains', undefined, { shallow: true });
    }
    if (router.query.error) {
      alert('❌ Connection failed: ' + router.query.error);
      router.replace('/studio/email/domains', undefined, { shallow: true });
    }
  }, [router.query]);

  const getAuth = function() {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: 'Bearer ' + token } };
  };

  const fetchAll = async function() {
    setLoading(true);
    await Promise.all([
      fetchDomains(),
      fetchBrevoSenders(),
      fetchConnections(),
      fetchProviders()
    ]);
    setLoading(false);
  };

  const fetchDomains = async function() {
    try {
      const res = await fetch(API_URL + '/api/sender-domains', getAuth());
      const data = await res.json();
      if (data.domains) setDomains(data.domains);
    } catch (err) {
      console.error('Fetch domains error:', err);
    }
  };

  const fetchBrevoSenders = async function() {
    try {
      const res = await fetch(API_URL + '/api/sender-domains/brevo/senders', getAuth());
      const data = await res.json();
      if (data.senders) setBrevoSenders(data.senders);
    } catch (err) {}
  };

  const fetchConnections = async function() {
    try {
      const res = await fetch(API_URL + '/api/dns-oauth/connections', getAuth());
      const data = await res.json();
      if (data.connections) setConnections(data.connections);
    } catch (err) {}
  };

  const fetchProviders = async function() {
    try {
      const res = await fetch(API_URL + '/api/dns-oauth/providers', getAuth());
      const data = await res.json();
      if (data.providers) setProviders(data.providers);
    } catch (err) {}
  };

  const startOAuth = async function(providerId) {
    try {
      setConnecting(true);
      const res = await fetch(API_URL + '/api/dns-oauth/oauth/' + providerId + '/start', getAuth());
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert(data.error || 'Failed to start OAuth');
        setConnecting(false);
      }
    } catch (err) {
      alert('Failed to start OAuth');
      setConnecting(false);
    }
  };

  const connectWithApiKey = async function(providerId) {
    setConnecting(true);
    try {
      const res = await fetch(API_URL + '/api/dns-oauth/connect/' + providerId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ credentials: apiCredentials })
      });
      
      const data = await res.json();
      if (data.ok) {
        alert('✅ Connected to ' + data.connection.providerName + '! Found ' + data.domains.length + ' domains.');
        setShowConnectProvider(false);
        setSelectedProvider(null);
        setApiCredentials({});
        fetchConnections();
      } else {
        alert(data.error || 'Connection failed');
      }
    } catch (err) {
      alert('Connection failed');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectProvider = async function(providerId) {
    if (!confirm('Disconnect this provider? You will need to re-enter credentials to use auto-setup again.')) return;
    try {
      await fetch(API_URL + '/api/dns-oauth/connections/' + providerId, { method: 'DELETE', ...getAuth() });
      setConnections(connections.filter(function(c) { return c.provider !== providerId; }));
    } catch (err) {
      alert('Failed to disconnect');
    }
  };

  const analyzeDomain = async function() {
    if (!newDomain.trim()) return;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await fetch(API_URL + '/api/sender-domains/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ domain: newDomain.trim() })
      });
      const data = await res.json();
      if (data.ok) setAnalysis(data.analysis);
    } catch (err) {}
    setAnalyzing(false);
  };

  const addDomain = async function() {
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
        setAnalysis(null);
        setExpandedDomain(data.domain._id);
        fetchBrevoSenders();
      } else {
        alert(data.error || 'Failed to add domain');
      }
    } catch (err) {
      alert('Failed to add domain');
    }
    setAdding(false);
  };

  const autoSetupDns = async function(domainObj) {
    // Find connected provider that has this domain
    const matchingConnection = connections.find(function(conn) {
      return conn.connected && conn.domains?.some(function(d) { return d.name === domainObj.domain; });
    });
    
    if (!matchingConnection) {
      alert('No connected provider found for ' + domainObj.domain + '. Please connect your DNS provider first.');
      return;
    }
    
    setAutoSetupProgress({ domainId: domainObj._id, status: 'Adding DNS records...' });
    
    try {
      // Build records array
      const records = [];
      if (domainObj.verification?.txtRecord?.name && domainObj.verification?.txtRecord?.value) {
        records.push({ type: 'TXT', name: domainObj.verification.txtRecord.name, value: domainObj.verification.txtRecord.value });
      }
      if (domainObj.verification?.spfRecord?.value) {
        records.push({ type: 'TXT', name: domainObj.domain, value: domainObj.verification.spfRecord.value });
      }
      if (domainObj.verification?.dkimRecord?.name && domainObj.verification?.dkimRecord?.value && !domainObj.verification.dkimRecord.value.includes('Check Brevo')) {
        records.push({ type: 'TXT', name: domainObj.verification.dkimRecord.name, value: domainObj.verification.dkimRecord.value });
      }
      if (domainObj.verification?.dmarcRecord?.name && domainObj.verification?.dmarcRecord?.value) {
        records.push({ type: 'TXT', name: domainObj.verification.dmarcRecord.name, value: domainObj.verification.dmarcRecord.value });
      }
      
      const res = await fetch(API_URL + '/api/dns-oauth/auto-setup/' + matchingConnection.provider, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ domain: domainObj.domain, records: records })
      });
      
      const data = await res.json();
      
      if (data.ok) {
        setAutoSetupProgress({ domainId: domainObj._id, status: 'success', message: 'DNS records added! Verifying...' });
        // Auto-verify after setup
        setTimeout(function() {
          verifyDomain(domainObj._id);
          setAutoSetupProgress(null);
        }, 2000);
      } else {
        setAutoSetupProgress({ domainId: domainObj._id, status: 'error', message: data.message || 'Some records failed' });
        setTimeout(function() { setAutoSetupProgress(null); }, 5000);
      }
    } catch (err) {
      setAutoSetupProgress({ domainId: domainObj._id, status: 'error', message: err.message });
      setTimeout(function() { setAutoSetupProgress(null); }, 5000);
    }
  };

  const checkPropagation = async function(domainId) {
    setCheckingPropagation(domainId);
    try {
      const res = await fetch(API_URL + '/api/sender-domains/' + domainId + '/check-propagation', { method: 'POST', ...getAuth() });
      const data = await res.json();
      if (data.ok) {
        setPropagationResults(function(prev) { 
          var updated = Object.assign({}, prev); 
          updated[domainId] = data.propagation; 
          return updated; 
        });
        if (data.propagation.allPropagated) {
          alert('✅ All DNS records have propagated! Click "Verify DNS" to complete.');
        }
      }
    } catch (err) {}
    setCheckingPropagation(null);
  };

  const verifyDomain = async function(domainId) {
    setVerifying(domainId);
    try {
      const res = await fetch(API_URL + '/api/sender-domains/' + domainId + '/verify', { method: 'POST', ...getAuth() });
      const data = await res.json();
      if (data.ok) {
        setDomains(domains.map(function(d) { return d._id === domainId ? data.domain : d; }));
        if (data.isFullyVerified) {
          alert('🎉 Domain verified! You can now send emails from this domain.');
        }
        fetchBrevoSenders();
      }
    } catch (err) {}
    setVerifying(null);
  };

  const deleteDomain = async function(domainId) {
    if (!confirm('Delete this domain?')) return;
    try {
      await fetch(API_URL + '/api/sender-domains/' + domainId, { method: 'DELETE', ...getAuth() });
      setDomains(domains.filter(function(d) { return d._id !== domainId; }));
    } catch (err) {}
  };

  const copyToClipboard = function(text, id) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(function() { setCopied(null); }, 2000);
  };

  const getStatusBadge = function(status) {
    const badges = {
      verified: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
      verifying: { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Verifying' },
      failed: { icon: AlertTriangle, bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
      pending: { icon: Clock, bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pending' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return <span className={'flex items-center gap-1 px-2 py-1 ' + badge.bg + ' ' + badge.text + ' text-xs font-medium rounded-full'}><Icon className="w-3 h-3" />{badge.label}</span>;
  };

  const isProviderConnected = function(providerId) {
    return connections.some(function(c) { return c.provider === providerId && c.connected; });
  };

  const getDomainConnection = function(domainName) {
    return connections.find(function(conn) {
      return conn.connected && conn.domains?.some(function(d) { return d.name === domainName; });
    });
  };

  const PropagationBar = function({ percent }) {
    const color = percent === 100 ? 'bg-green-500' : percent > 50 ? 'bg-yellow-500' : 'bg-gray-300';
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={color + ' h-full transition-all duration-500'} style={{ width: percent + '%' }}></div>
        </div>
        <span className="text-xs text-gray-500 w-10">{percent}%</span>
      </div>
    );
  };

  const DnsRecord = function({ type, label, name, value, verified, propagation, required }) {
    const recordId = label + '-' + name;
    return (
      <div className={'rounded-lg border p-4 mb-3 ' + (verified ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200')}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-mono font-medium rounded">{type}</span>
            <span className="font-medium text-gray-900">{label}</span>
            {!required && <span className="text-xs text-gray-500">(Recommended)</span>}
          </div>
          {verified ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-gray-400" />}
        </div>
        {propagation > 0 && !verified && <div className="mb-2"><PropagationBar percent={propagation} /></div>}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-gray-500 mb-1">Name/Host</div>
            <div className="flex items-center gap-1">
              <code className="flex-1 bg-gray-100 px-2 py-1.5 rounded text-xs truncate">{name}</code>
              <button onClick={function() { copyToClipboard(name, recordId + '-n'); }} className="p-1.5 hover:bg-gray-100 rounded">
                {copied === recordId + '-n' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Value</div>
            <div className="flex items-center gap-1">
              <code className="flex-1 bg-gray-100 px-2 py-1.5 rounded text-xs truncate">{value}</code>
              <button onClick={function() { copyToClipboard(value, recordId + '-v'); }} className="p-1.5 hover:bg-gray-100 rounded">
                {copied === recordId + '-v' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const verifiedDomains = brevoSenders.reduce(function(acc, s) {
    if (s.active) {
      const d = s.email.split('@')[1];
      if (!acc[d]) acc[d] = [];
      acc[d].push(s);
    }
    return acc;
  }, {});

  return (
    <AppLayout>
      <Head><title>Sender Domains - CYBEV Email</title></Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/studio/campaigns" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Email
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Sender Domains</h1>
            <p className="text-gray-600 mt-1">Verify custom domains to send emails from your own addresses</p>
          </div>
          <div className="flex gap-2">
            <button onClick={function() { setShowConnectProvider(true); }} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Link2 className="w-4 h-4" />Connect DNS
            </button>
            <button onClick={function() { setShowAddDomain(true); setAnalysis(null); setNewDomain(''); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Plus className="w-5 h-5" />Add Domain
            </button>
          </div>
        </div>

        {/* Connected Providers */}
        {connections.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Connected DNS Providers</h3>
            <div className="flex flex-wrap gap-2">
              {connections.filter(function(c) { return c.connected; }).map(function(conn) {
                return (
                  <div key={conn.provider} className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">{conn.providerName}</span>
                    <span className="text-xs text-green-600">({conn.domains?.length || 0} domains)</span>
                    <button onClick={function() { disconnectProvider(conn.provider); }} className="p-1 hover:bg-green-100 rounded" title="Disconnect">
                      <X className="w-3 h-3 text-green-600" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 mb-6 border border-purple-100">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm"><Shield className="w-5 h-5 text-purple-600" /></div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Why verify your domain?</h3>
              <p className="text-gray-600 text-sm">
                Send emails from addresses like <strong>you@yourdomain.com</strong> instead of the default CYBEV address.
                {connections.length === 0 && <span className="text-purple-600"> Connect your DNS provider for one-click setup!</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Verified Senders */}
        {Object.keys(verifiedDomains).length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />Active Senders
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 divide-y">
              {Object.entries(verifiedDomains).map(function([domain, senders]) {
                return (
                  <div key={domain} className="p-3 flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{domain}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                    <div className="flex-1 flex flex-wrap gap-1 justify-end">
                      {senders.map(function(s) {
                        return <span key={s.id} className="text-xs text-gray-500">{s.email}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Connect Provider Modal */}
        {showConnectProvider && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Connect DNS Provider</h2>
                <p className="text-sm text-gray-500 mt-1">Connect your DNS provider for one-click DNS record setup</p>
              </div>
              
              {!selectedProvider ? (
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {providers.map(function(p) {
                      const connected = isProviderConnected(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={function() { if (!connected) setSelectedProvider(p); }}
                          disabled={connected}
                          className={'p-4 border rounded-lg text-left transition-all ' + (connected ? 'bg-green-50 border-green-200' : 'hover:border-purple-300 hover:bg-purple-50')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {p.logo ? <img src={p.logo} alt="" className="w-6 h-6" /> : <Server className="w-5 h-5 text-gray-400" />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{p.name}</div>
                              <div className="text-xs text-gray-500">
                                {connected ? <span className="text-green-600">Connected ✓</span> : (p.type === 'oauth' && p.oauthAvailable ? 'OAuth' : 'API Key')}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <button onClick={function() { setSelectedProvider(null); setApiCredentials({}); }} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to providers
                  </button>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {selectedProvider.logo ? <img src={selectedProvider.logo} alt="" className="w-8 h-8" /> : <Server className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedProvider.name}</h3>
                      <div className="text-sm text-gray-500">{selectedProvider.type === 'oauth' ? 'Sign in with OAuth' : 'Enter API credentials'}</div>
                    </div>
                  </div>
                  
                  {selectedProvider.type === 'oauth' && selectedProvider.oauthAvailable ? (
                    <button
                      onClick={function() { startOAuth(selectedProvider.id); }}
                      disabled={connecting}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {connecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ExternalLink className="w-5 h-5" />}
                      Connect with {selectedProvider.name}
                    </button>
                  ) : selectedProvider.fields ? (
                    <div className="space-y-4">
                      {selectedProvider.fields.map(function(field) {
                        return (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            <div className="relative">
                              <input
                                type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
                                value={apiCredentials[field.key] || field.default || ''}
                                onChange={function(e) { setApiCredentials(Object.assign({}, apiCredentials, { [field.key]: e.target.value })); }}
                                placeholder={field.placeholder}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 pr-10"
                              />
                              {field.secret && (
                                <button
                                  type="button"
                                  onClick={function() { setShowSecrets(Object.assign({}, showSecrets, { [field.key]: !showSecrets[field.key] })); }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showSecrets[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {selectedProvider.note && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                          <AlertCircle className="w-4 h-4 inline mr-1" />{selectedProvider.note}
                        </div>
                      )}
                      
                      {selectedProvider.helpUrl && (
                        <a href={selectedProvider.helpUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                          Get your API credentials <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      
                      <button
                        onClick={function() { connectWithApiKey(selectedProvider.id); }}
                        disabled={connecting}
                        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {connecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                        Connect
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-100 rounded-lg text-gray-600 text-center">
                      OAuth not configured for this provider. Contact support.
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button onClick={function() { setShowConnectProvider(false); setSelectedProvider(null); setApiCredentials({}); }} className="w-full py-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Domain Modal */}
        {showAddDomain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Add Sender Domain</h2>
                <p className="text-sm text-gray-500 mt-1">We'll auto-detect your DNS provider</p>
              </div>
              
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newDomain}
                      onChange={function(e) { setNewDomain(e.target.value); setAnalysis(null); }}
                      onKeyDown={function(e) { if (e.key === 'Enter') analyzeDomain(); }}
                      placeholder="example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button onClick={analyzeDomain} disabled={analyzing || !newDomain.trim()} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2">
                    {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Detect
                  </button>
                </div>
                
                {analysis && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium">{analysis.dns?.name || 'Unknown'}</div>
                        {analysis.dns?.hasApi && (
                          <span className="text-xs text-green-600">
                            {getDomainConnection(newDomain.trim()) ? '✓ Connected - One-click setup available!' : 'Auto-setup available'}
                          </span>
                        )}
                      </div>
                    </div>
                    {analysis.registrar?.detected && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span>Registrar: {analysis.registrar.registrar}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                <button onClick={function() { setShowAddDomain(false); setNewDomain(''); setAnalysis(null); }} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={addDomain} disabled={adding || !newDomain.trim()} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
                  {adding && <Loader2 className="w-4 h-4 animate-spin" />}Add Domain
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Domains List */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Domains</h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
        ) : domains.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No domains yet</h3>
            <p className="text-gray-500 mb-4">Add your first custom sender domain to get started</p>
            {connections.length === 0 && (
              <p className="text-sm text-purple-600 mb-4">Connect your DNS provider for one-click setup!</p>
            )}
            <div className="flex justify-center gap-3">
              {connections.length === 0 && (
                <button onClick={function() { setShowConnectProvider(true); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />Connect DNS
                </button>
              )}
              <button onClick={function() { setShowAddDomain(true); }} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Add Domain
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {domains.map(function(domain) {
              const domainConnection = getDomainConnection(domain.domain);
              const setupProgress = autoSetupProgress?.domainId === domain._id ? autoSetupProgress : null;
              
              return (
                <div key={domain._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={function() { setExpandedDomain(expandedDomain === domain._id ? null : domain._id); }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={'w-10 h-10 rounded-lg flex items-center justify-center ' + (domain.status === 'verified' ? 'bg-green-100' : 'bg-purple-100')}>
                        <Globe className={'w-5 h-5 ' + (domain.status === 'verified' ? 'text-green-600' : 'text-purple-600')} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{domain.domain}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          {domain.dnsProvider?.name && <span>{domain.dnsProvider.name}</span>}
                          {domainConnection && <span className="text-green-600 text-xs">✓ Auto-setup ready</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(domain.status)}
                      {expandedDomain === domain._id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  {expandedDomain === domain._id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      {/* Auto Setup Banner */}
                      {domainConnection && domain.status !== 'verified' && (
                        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Sparkles className="w-5 h-5 text-purple-600" />
                              <div>
                                <div className="font-medium text-purple-900">One-Click DNS Setup</div>
                                <div className="text-sm text-purple-700">Connected to {domainConnection.providerName}</div>
                              </div>
                            </div>
                            <button
                              onClick={function(e) { e.stopPropagation(); autoSetupDns(domain); }}
                              disabled={setupProgress}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                            >
                              {setupProgress ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  {setupProgress.status === 'success' ? 'Done!' : setupProgress.status === 'error' ? 'Failed' : 'Setting up...'}
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  Auto-Setup DNS
                                </>
                              )}
                            </button>
                          </div>
                          {setupProgress?.message && (
                            <div className={'mt-2 text-sm ' + (setupProgress.status === 'error' ? 'text-red-600' : 'text-purple-700')}>
                              {setupProgress.message}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">DNS Records</h4>
                        <div className="flex items-center gap-2">
                          <button onClick={function(e) { e.stopPropagation(); checkPropagation(domain._id); }} disabled={checkingPropagation === domain._id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50">
                            {checkingPropagation === domain._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                            Check
                          </button>
                          <button onClick={function(e) { e.stopPropagation(); verifyDomain(domain._id); }} disabled={verifying === domain._id} className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50">
                            {verifying === domain._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            Verify
                          </button>
                          <button onClick={function(e) { e.stopPropagation(); deleteDomain(domain._id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {!domainConnection && (
                        <p className="text-sm text-gray-600 mb-4">Add these DNS records to your domain's DNS settings, or <button onClick={function() { setShowConnectProvider(true); }} className="text-purple-600 hover:underline">connect your DNS provider</button> for automatic setup.</p>
                      )}

                      {domain.verification?.txtRecord && (
                        <DnsRecord type="TXT" label="Domain Verification" name={domain.verification.txtRecord.name} value={domain.verification.txtRecord.value} verified={domain.verification.txtRecord.verified} propagation={domain.verification.txtRecord.propagation || 0} required={true} />
                      )}
                      {domain.verification?.spfRecord && (
                        <DnsRecord type="TXT" label="SPF Record" name={domain.verification.spfRecord.name || domain.domain} value={domain.verification.spfRecord.value} verified={domain.verification.spfRecord.verified} propagation={domain.verification.spfRecord.propagation || 0} required={true} />
                      )}
                      {domain.verification?.dkimRecord && (
                        <DnsRecord type="TXT" label="DKIM" name={domain.verification.dkimRecord.name} value={domain.verification.dkimRecord.value} verified={domain.verification.dkimRecord.verified} propagation={domain.verification.dkimRecord.propagation || 0} required={true} />
                      )}
                      {domain.verification?.dmarcRecord && (
                        <DnsRecord type="TXT" label="DMARC" name={domain.verification.dmarcRecord.name} value={domain.verification.dmarcRecord.value} verified={domain.verification.dmarcRecord.verified} propagation={domain.verification.dmarcRecord.propagation || 0} required={false} />
                      )}

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                        <Info className="w-4 h-4 inline mr-1" />
                        DNS changes can take up to 48 hours to propagate worldwide.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
