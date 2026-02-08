// ============================================
// FILE: src/pages/studio/email/domains.jsx
// CYBEV Sender Domain Verification UI
// VERSION: 5.0.0 - Simplified (API Keys Only)
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Globe, Plus, Check, X, AlertCircle, RefreshCw, Trash2,
  Copy, ExternalLink, Shield, Mail, ChevronDown, ChevronUp,
  Loader2, CheckCircle, Clock, AlertTriangle, ArrowLeft,
  Info, Zap, Server, Sparkles, Play, Eye, EyeOff, Link2, Key
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function DomainVerification() {
  const [domains, setDomains] = useState([]);
  const [brevoSenders, setBrevoSenders] = useState([]);
  const [connections, setConnections] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [showConnectProvider, setShowConnectProvider] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  // Form states
  const [newDomain, setNewDomain] = useState('');
  const [apiCredentials, setApiCredentials] = useState({});
  const [showSecrets, setShowSecrets] = useState({});
  
  // Loading states
  const [adding, setAdding] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [verifying, setVerifying] = useState(null);
  const [autoSetupLoading, setAutoSetupLoading] = useState(null);
  
  // UI states
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(function() {
    fetchAll();
  }, []);

  var getAuth = function() {
    var token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: 'Bearer ' + token } };
  };

  var fetchAll = async function() {
    setLoading(true);
    await Promise.all([fetchDomains(), fetchBrevoSenders(), fetchConnections(), fetchProviders()]);
    setLoading(false);
  };

  var fetchDomains = async function() {
    try {
      var res = await fetch(API_URL + '/api/sender-domains', getAuth());
      var data = await res.json();
      if (data.domains) setDomains(data.domains);
    } catch (err) {}
  };

  var fetchBrevoSenders = async function() {
    try {
      var res = await fetch(API_URL + '/api/sender-domains/brevo/senders', getAuth());
      var data = await res.json();
      if (data.senders) setBrevoSenders(data.senders);
    } catch (err) {}
  };

  var fetchConnections = async function() {
    try {
      var res = await fetch(API_URL + '/api/dns-providers/connections', getAuth());
      var data = await res.json();
      if (data.connections) setConnections(data.connections);
    } catch (err) {}
  };

  var fetchProviders = async function() {
    try {
      var res = await fetch(API_URL + '/api/dns-providers/providers', getAuth());
      var data = await res.json();
      if (data.providers) setProviders(data.providers);
    } catch (err) {}
  };

  var connectProvider = async function() {
    if (!selectedProvider) return;
    setConnecting(true);
    try {
      var res = await fetch(API_URL + '/api/dns-providers/connect/' + selectedProvider.id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ credentials: apiCredentials })
      });
      var data = await res.json();
      if (data.ok) {
        alert('✅ Connected to ' + data.connection.providerName + '! Found ' + data.domainCount + ' domains.');
        setShowConnectProvider(false);
        setSelectedProvider(null);
        setApiCredentials({});
        fetchConnections();
      } else {
        alert('❌ ' + (data.error || 'Connection failed'));
      }
    } catch (err) {
      alert('Connection failed');
    }
    setConnecting(false);
  };

  var disconnectProvider = async function(providerId) {
    if (!confirm('Disconnect this provider?')) return;
    try {
      await fetch(API_URL + '/api/dns-providers/connections/' + providerId, { method: 'DELETE', ...getAuth() });
      setConnections(connections.filter(function(c) { return c.provider !== providerId; }));
    } catch (err) {}
  };

  var addDomain = async function() {
    if (!newDomain.trim()) return;
    setAdding(true);
    try {
      var res = await fetch(API_URL + '/api/sender-domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ domain: newDomain.trim() })
      });
      var data = await res.json();
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
    }
    setAdding(false);
  };

  var autoSetupDns = async function(domainObj) {
    var conn = connections.find(function(c) {
      return c.connected && c.domains?.some(function(d) { return d.name === domainObj.domain; });
    });
    
    if (!conn) {
      alert('Domain not found in any connected provider. Please connect your DNS provider first.');
      return;
    }
    
    setAutoSetupLoading(domainObj._id);
    try {
      var records = [];
      if (domainObj.verification?.txtRecord?.name) {
        records.push({ type: 'TXT', name: domainObj.verification.txtRecord.name, value: domainObj.verification.txtRecord.value });
      }
      if (domainObj.verification?.spfRecord?.value) {
        records.push({ type: 'TXT', name: domainObj.domain, value: domainObj.verification.spfRecord.value });
      }
      if (domainObj.verification?.dkimRecord?.name && !domainObj.verification.dkimRecord.value.includes('Check Brevo')) {
        records.push({ type: 'TXT', name: domainObj.verification.dkimRecord.name, value: domainObj.verification.dkimRecord.value });
      }
      if (domainObj.verification?.dmarcRecord?.name) {
        records.push({ type: 'TXT', name: domainObj.verification.dmarcRecord.name, value: domainObj.verification.dmarcRecord.value });
      }
      
      var res = await fetch(API_URL + '/api/dns-providers/auto-setup/' + conn.provider, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ domain: domainObj.domain, records: records })
      });
      var data = await res.json();
      
      if (data.ok) {
        alert('✅ ' + data.message + '\n\nVerifying domain now...');
        verifyDomain(domainObj._id);
      } else {
        alert('⚠️ ' + data.message);
      }
    } catch (err) {
      alert('Auto-setup failed: ' + err.message);
    }
    setAutoSetupLoading(null);
  };

  var verifyDomain = async function(domainId) {
    setVerifying(domainId);
    try {
      var res = await fetch(API_URL + '/api/sender-domains/' + domainId + '/verify', { method: 'POST', ...getAuth() });
      var data = await res.json();
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

  var deleteDomain = async function(domainId) {
    if (!confirm('Delete this domain?')) return;
    try {
      await fetch(API_URL + '/api/sender-domains/' + domainId, { method: 'DELETE', ...getAuth() });
      setDomains(domains.filter(function(d) { return d._id !== domainId; }));
    } catch (err) {}
  };

  var copyToClipboard = function(text, id) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(function() { setCopied(null); }, 2000);
  };

  var isConnected = function(providerId) {
    return connections.some(function(c) { return c.provider === providerId && c.connected; });
  };

  var getDomainConnection = function(domainName) {
    return connections.find(function(c) {
      return c.connected && c.domains?.some(function(d) { return d.name === domainName; });
    });
  };

  var StatusBadge = function({ status }) {
    var config = {
      verified: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Verified' },
      verifying: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Verifying' },
      pending: { bg: 'bg-gray-100', text: 'text-gray-600', icon: Clock, label: 'Pending' }
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-600', icon: Clock, label: 'Pending' };
    var Icon = config.icon;
    return <span className={'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ' + config.bg + ' ' + config.text}><Icon className="w-3 h-3" />{config.label}</span>;
  };

  var DnsRecord = function({ type, label, name, value, verified }) {
    var id = label + name;
    return (
      <div className={'rounded-lg border p-3 mb-2 ' + (verified ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200')}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-mono rounded">{type}</span>
            <span className="font-medium text-gray-900 text-sm">{label}</span>
          </div>
          {verified && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-gray-500 mb-1">Name</div>
            <div className="flex items-center gap-1">
              <code className="flex-1 bg-gray-100 px-2 py-1 rounded truncate">{name}</code>
              <button onClick={function() { copyToClipboard(name, id + 'n'); }} className="p-1 hover:bg-gray-200 rounded">
                {copied === id + 'n' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Value</div>
            <div className="flex items-center gap-1">
              <code className="flex-1 bg-gray-100 px-2 py-1 rounded truncate">{value}</code>
              <button onClick={function() { copyToClipboard(value, id + 'v'); }} className="p-1 hover:bg-gray-200 rounded">
                {copied === id + 'v' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <Head><title>Sender Domains - CYBEV</title></Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/studio/campaigns" className="text-purple-600 hover:underline text-sm mb-1 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Campaigns
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Sender Domains</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={function() { setShowConnectProvider(true); setSelectedProvider(null); setApiCredentials({}); }} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Link2 className="w-4 h-4" />Connect DNS
            </button>
            <button onClick={function() { setShowAddDomain(true); setNewDomain(''); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
              <Plus className="w-4 h-4" />Add Domain
            </button>
          </div>
        </div>

        {/* Connected Providers */}
        {connections.filter(function(c) { return c.connected; }).length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {connections.filter(function(c) { return c.connected; }).map(function(conn) {
              return (
                <div key={conn.provider} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">{conn.providerName}</span>
                  <span className="text-green-600 text-xs">({conn.domains?.length})</span>
                  <button onClick={function() { disconnectProvider(conn.provider); }} className="p-0.5 hover:bg-green-100 rounded">
                    <X className="w-3 h-3 text-green-600" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-100">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-purple-900 text-sm">
                <strong>Send from your own domain</strong> like you@yourdomain.com instead of info@cybev.io.
                {connections.length === 0 && <span className="text-purple-600"> Connect your DNS provider for one-click setup!</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Connect Provider Modal */}
        {showConnectProvider && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
              <div className="p-5 border-b">
                <h2 className="text-lg font-bold">Connect DNS Provider</h2>
                <p className="text-sm text-gray-500">Connect for one-click DNS setup</p>
              </div>
              
              {!selectedProvider ? (
                <div className="p-4 grid grid-cols-2 gap-2">
                  {providers.map(function(p) {
                    var connected = isConnected(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={function() { if (!connected) setSelectedProvider(p); }}
                        disabled={connected}
                        className={'p-3 border rounded-lg text-left ' + (connected ? 'bg-green-50 border-green-200' : 'hover:border-purple-300 hover:bg-purple-50')}
                      >
                        <div className="flex items-center gap-2">
                          {p.logo ? <img src={p.logo} alt="" className="w-6 h-6" /> : <Server className="w-5 h-5 text-gray-400" />}
                          <div>
                            <div className="font-medium text-sm">{p.name}</div>
                            {connected && <div className="text-xs text-green-600">Connected ✓</div>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5">
                  <button onClick={function() { setSelectedProvider(null); setApiCredentials({}); }} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  
                  <div className="flex items-center gap-3 mb-5">
                    {selectedProvider.logo ? <img src={selectedProvider.logo} alt="" className="w-10 h-10" /> : <Server className="w-8 h-8 text-gray-400" />}
                    <div>
                      <div className="font-semibold">{selectedProvider.name}</div>
                      <div className="text-xs text-gray-500">{selectedProvider.helpText}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedProvider.fields.map(function(field) {
                      return (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                          <div className="relative">
                            <input
                              type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
                              value={apiCredentials[field.key] || ''}
                              onChange={function(e) { setApiCredentials(Object.assign({}, apiCredentials, { [field.key]: e.target.value })); }}
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                            {field.secret && (
                              <button onClick={function() { setShowSecrets(Object.assign({}, showSecrets, { [field.key]: !showSecrets[field.key] })); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                                {showSecrets[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {selectedProvider.note && (
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        ⚠️ {selectedProvider.note}
                      </div>
                    )}
                    
                    <a href={selectedProvider.helpUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                      Get your API key <ExternalLink className="w-3 h-3" />
                    </a>
                    
                    <button onClick={connectProvider} disabled={connecting} className="w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                      {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                      Connect
                    </button>
                  </div>
                </div>
              )}
              
              <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                <button onClick={function() { setShowConnectProvider(false); }} className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Domain Modal */}
        {showAddDomain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
              <div className="p-5 border-b">
                <h2 className="text-lg font-bold">Add Sender Domain</h2>
              </div>
              <div className="p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={newDomain}
                    onChange={function(e) { setNewDomain(e.target.value); }}
                    onKeyDown={function(e) { if (e.key === 'Enter') addDomain(); }}
                    placeholder="example.com"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Don't include www or http://</p>
              </div>
              <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-2">
                <button onClick={function() { setShowAddDomain(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm">Cancel</button>
                <button onClick={addDomain} disabled={adding || !newDomain.trim()} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 text-sm">
                  {adding && <Loader2 className="w-4 h-4 animate-spin" />}Add Domain
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Domains List */}
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
        ) : domains.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">No domains yet</h3>
            <p className="text-sm text-gray-500 mb-4">Add your first custom sender domain</p>
            <button onClick={function() { setShowAddDomain(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Add Domain</button>
          </div>
        ) : (
          <div className="space-y-3">
            {domains.map(function(domain) {
              var conn = getDomainConnection(domain.domain);
              var isExpanded = expandedDomain === domain._id;
              
              return (
                <div key={domain._id} className="bg-white rounded-xl border overflow-hidden">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={function() { setExpandedDomain(isExpanded ? null : domain._id); }}>
                    <div className="flex items-center gap-3">
                      <div className={'w-9 h-9 rounded-lg flex items-center justify-center ' + (domain.status === 'verified' ? 'bg-green-100' : 'bg-purple-100')}>
                        <Globe className={'w-5 h-5 ' + (domain.status === 'verified' ? 'text-green-600' : 'text-purple-600')} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{domain.domain}</div>
                        {conn && <div className="text-xs text-green-600">✓ {conn.providerName} connected</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={domain.status} />
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t p-4 bg-gray-50">
                      {/* One-Click Setup Banner */}
                      {conn && domain.status !== 'verified' && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-purple-600" />
                              <div>
                                <div className="font-medium text-purple-900 text-sm">One-Click Setup Available</div>
                                <div className="text-xs text-purple-700">Add all DNS records automatically via {conn.providerName}</div>
                              </div>
                            </div>
                            <button
                              onClick={function(e) { e.stopPropagation(); autoSetupDns(domain); }}
                              disabled={autoSetupLoading === domain._id}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 text-sm"
                            >
                              {autoSetupLoading === domain._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                              Auto-Setup
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">DNS Records</span>
                        <div className="flex gap-2">
                          <button onClick={function(e) { e.stopPropagation(); verifyDomain(domain._id); }} disabled={verifying === domain._id} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-1 disabled:opacity-50">
                            {verifying === domain._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                            Verify
                          </button>
                          <button onClick={function(e) { e.stopPropagation(); deleteDomain(domain._id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {!conn && (
                        <p className="text-sm text-gray-600 mb-3">
                          Add these records to your DNS, or <button onClick={function() { setShowConnectProvider(true); }} className="text-purple-600 hover:underline">connect your DNS provider</button> for automatic setup.
                        </p>
                      )}

                      {/* DNS Records */}
                      {domain.verification?.txtRecord && (
                        <DnsRecord type="TXT" label="Verification" name={domain.verification.txtRecord.name} value={domain.verification.txtRecord.value} verified={domain.verification.txtRecord.verified} />
                      )}
                      {domain.verification?.spfRecord && (
                        <DnsRecord type="TXT" label="SPF" name={domain.verification.spfRecord.name || domain.domain} value={domain.verification.spfRecord.value} verified={domain.verification.spfRecord.verified} />
                      )}
                      {domain.verification?.dkimRecord && (
                        <DnsRecord type="TXT" label="DKIM" name={domain.verification.dkimRecord.name} value={domain.verification.dkimRecord.value} verified={domain.verification.dkimRecord.verified} />
                      )}
                      {domain.verification?.dmarcRecord && (
                        <DnsRecord type="TXT" label="DMARC" name={domain.verification.dmarcRecord.name} value={domain.verification.dmarcRecord.value} verified={domain.verification.dmarcRecord.verified} />
                      )}

                      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                        <Info className="w-3 h-3 inline mr-1" />
                        DNS changes can take up to 48 hours to propagate.
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
