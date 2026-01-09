// ============================================
// FILE: src/pages/settings/domains.jsx
// Domain Management Page - v6.4
// Register, Transfer, Renew, DNS Presets
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { Globe, Search, Plus, RefreshCw, Settings, AlertTriangle, Check, Clock, ArrowRight, ChevronRight, ExternalLink, Shield, Mail, Server, Loader2, Calendar, Lock, Unlock, Copy, CheckCircle, XCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const PRESET_ICONS = { cybev: '🌐', googleWorkspace: '📧', microsoft365: '📬', zohoMail: '✉️', vercel: '▲', netlify: '🔷', cloudflare: '☁️', github: '🐙', shopify: '🛒', cybevWithEmail: '🚀', redirect: '↗️' };

export default function DomainsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState([]);
  const [activeTab, setActiveTab] = useState('my-domains');
  const [selectedDomain, setSelectedDomain] = useState(null);
  
  // Search/Register
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [pricing, setPricing] = useState([]);
  
  // Transfer
  const [transferDomain, setTransferDomain] = useState('');
  const [transferAuthCode, setTransferAuthCode] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [transferCheck, setTransferCheck] = useState(null);
  
  // Payment providers
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('GHS');
  
  // DNS
  const [dnsPresets, setDnsPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [presetInputs, setPresetInputs] = useState({});
  
  // Modals
  const [showDNSModal, setShowDNSModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showTransferOutModal, setShowTransferOutModal] = useState(false);

  useEffect(() => { fetchDomains(); fetchPricing(); fetchDNSPresets(); fetchProviders(); }, []);

  const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  const fetchDomains = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/domain-payments/my-domains`, getAuth());
      if (res.data.ok) setDomains(res.data.domains);
    } catch (err) { console.error('Fetch domains error:', err); }
    finally { setLoading(false); }
  };

  const fetchPricing = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/domain-payments/pricing?currency=${selectedCurrency}`);
      if (res.data.ok) {
        setPricing(res.data.pricing);
        if (res.data.providers) setProviders(res.data.providers);
      }
    } catch (err) {}
  };

  const fetchProviders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/domain-payments/providers`);
      if (res.data.ok) {
        setProviders(res.data.providers);
        if (res.data.providers.length > 0 && !selectedProvider) {
          setSelectedProvider(res.data.providers[0].id);
        }
      }
    } catch (err) {}
  };

  const fetchDNSPresets = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dns-presets`);
      if (res.data.ok) setDnsPresets(res.data.presets);
    } catch (err) {}
  };

  const searchDomains = async () => {
    if (!searchQuery || searchQuery.length < 2) return;
    setSearching(true);
    try {
      const res = await axios.get(`${API_URL}/api/domains/search?keyword=${encodeURIComponent(searchQuery)}`, getAuth());
      if (res.data.ok) setSearchResults(res.data.suggestions);
    } catch (err) {}
    finally { setSearching(false); }
  };

  const registerDomain = async (domain) => {
    try {
      const res = await axios.post(`${API_URL}/api/domain-payments/initialize`, { 
        domain, 
        years: 1, 
        currency: selectedCurrency,
        provider: selectedProvider 
      }, getAuth());
      if (res.data.ok && res.data.authorizationUrl) window.location.href = res.data.authorizationUrl;
    } catch (err) { alert(err.response?.data?.error || 'Payment failed'); }
  };

  const renewDomain = async (domainId, years = 1) => {
    try {
      const res = await axios.post(`${API_URL}/api/domain-payments/renew`, { 
        domainId, 
        years, 
        currency: selectedCurrency,
        provider: selectedProvider 
      }, getAuth());
      if (res.data.ok && res.data.authorizationUrl) window.location.href = res.data.authorizationUrl;
    } catch (err) { alert(err.response?.data?.error || 'Renewal failed'); }
  };

  const checkTransfer = async () => {
    if (!transferDomain) return;
    try {
      const res = await axios.get(`${API_URL}/api/domain-transfer/check?domain=${encodeURIComponent(transferDomain)}`, getAuth());
      setTransferCheck(res.data);
    } catch (err) {}
  };

  const initiateTransfer = async () => {
    if (!transferDomain || !transferAuthCode) { alert('Enter domain and auth code'); return; }
    setTransferring(true);
    try {
      const res = await axios.post(`${API_URL}/api/domain-transfer/initiate`, { domain: transferDomain, authCode: transferAuthCode }, getAuth());
      if (res.data.ok) {
        alert('Transfer initiated! ' + res.data.note);
        setTransferDomain(''); setTransferAuthCode(''); setTransferCheck(null);
        fetchDomains(); setActiveTab('my-domains');
      }
    } catch (err) { alert(err.response?.data?.error || 'Transfer failed'); }
    finally { setTransferring(false); }
  };

  const applyDNSPreset = async (presetId) => {
    if (!selectedDomain) return;
    try {
      const res = await axios.post(`${API_URL}/api/dns-presets/apply`, { domainId: selectedDomain._id, presetId, inputs: presetInputs }, getAuth());
      if (res.data.ok) { alert('DNS preset applied!'); setShowDNSModal(false); fetchDomains(); }
    } catch (err) { alert(err.response?.data?.error || 'Failed to apply preset'); }
  };

  const getTransferAuthCode = async (domainId) => {
    try {
      const res = await axios.get(`${API_URL}/api/domain-transfer/auth-code/${domainId}`, getAuth());
      if (res.data.ok) { navigator.clipboard.writeText(res.data.authCode); alert(`Auth code copied: ${res.data.authCode}\n\n${res.data.note}`); }
    } catch (err) { alert(err.response?.data?.error || 'Failed to get auth code'); }
  };

  const toggleDomainLock = async (domainId, lock) => {
    try {
      const endpoint = lock ? 'lock' : 'unlock';
      const res = await axios.post(`${API_URL}/api/domain-transfer/${endpoint}/${domainId}`, {}, getAuth());
      if (res.data.ok) { alert(res.data.message); fetchDomains(); }
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const getDaysColor = (days) => {
    if (days <= 0) return 'text-red-600 bg-red-50';
    if (days <= 7) return 'text-orange-600 bg-orange-50';
    if (days <= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;

  return (
    <>
      <Head><title>Domain Management | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => router.back()} className="text-gray-600 dark:text-gray-400">←</button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Globe className="w-5 h-5 text-purple-600" />Domains</h1>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {[{ id: 'my-domains', label: 'My Domains', icon: Globe }, { id: 'register', label: 'Register', icon: Plus }, { id: 'transfer', label: 'Transfer', icon: ArrowRight }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === tab.id ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  <tab.icon className="w-4 h-4" />{tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* My Domains */}
          {activeTab === 'my-domains' && (
            <div className="space-y-4">
              {domains.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                  <Globe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No domains yet</h3>
                  <p className="text-gray-500 mb-4">Register or transfer your first domain</p>
                  <button onClick={() => setActiveTab('register')} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">Register Domain</button>
                </div>
              ) : domains.map(domain => (
                <div key={domain._id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          {domain.domain}
                          {domain.registrar?.locked && <Lock className="w-4 h-4 text-green-500" />}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${domain.status === 'active' ? 'bg-green-100 text-green-700' : domain.status === 'expired' ? 'bg-red-100 text-red-700' : domain.status === 'transferring' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{domain.status}</span>
                          {domain.linkedSite && <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" />{domain.linkedSite.name}</span>}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getDaysColor(domain.daysUntilExpiry)}`}>
                        {domain.isExpired ? 'EXPIRED' : domain.daysUntilExpiry <= 0 ? 'Expiring today' : `${domain.daysUntilExpiry} days left`}
                      </div>
                    </div>

                    {domain.needsRenewal && !domain.isExpired && (
                      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm text-yellow-700 dark:text-yellow-400">Expires soon. Renew to avoid losing it.</span>
                        <button onClick={() => { setSelectedDomain(domain); setShowRenewModal(true); }} className="ml-auto px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg font-medium">Renew Now</button>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => { setSelectedDomain(domain); setShowDNSModal(true); }} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"><Server className="w-4 h-4" />DNS</button>
                      <button onClick={() => { setSelectedDomain(domain); setShowRenewModal(true); }} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"><RefreshCw className="w-4 h-4" />Renew</button>
                      <button onClick={() => { setSelectedDomain(domain); setShowTransferOutModal(true); }} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"><ArrowRight className="w-4 h-4" />Transfer Out</button>
                    </div>

                    <div className="mt-4 pt-4 border-t dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-gray-500">Expires</span><p className="font-medium text-gray-900 dark:text-white">{new Date(domain.expiresAt).toLocaleDateString()}</p></div>
                      <div><span className="text-gray-500">Auto-Renew</span><p className="font-medium text-gray-900 dark:text-white">{domain.autoRenew ? '✅ On' : '❌ Off'}</p></div>
                      <div><span className="text-gray-500">DNS Preset</span><p className="font-medium text-gray-900 dark:text-white">{domain.dns?.preset || 'Custom'}</p></div>
                      <div><span className="text-gray-500">Lock</span><p className="font-medium text-gray-900 dark:text-white">{domain.registrar?.locked ? '🔒 Locked' : '🔓 Unlocked'}</p></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Register */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Find Your Perfect Domain</h2>
                
                {/* Payment Provider & Currency Selection */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                    <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)} className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                    <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="GHS">🇬🇭 GHS (Cedis)</option>
                      <option value="NGN">🇳🇬 NGN (Naira)</option>
                      <option value="USD">🇺🇸 USD (Dollar)</option>
                      <option value="EUR">🇪🇺 EUR (Euro)</option>
                      <option value="GBP">🇬🇧 GBP (Pound)</option>
                      <option value="KES">🇰🇪 KES (Shilling)</option>
                      <option value="ZAR">🇿🇦 ZAR (Rand)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchDomains()} placeholder="Enter domain name (e.g., mybrand)" className="flex-1 px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <button onClick={searchDomains} disabled={searching} className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2">
                    {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}Search
                  </button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b dark:border-gray-700"><h3 className="font-medium text-gray-900 dark:text-white">Available Domains</h3></div>
                  <div className="divide-y dark:divide-gray-700">
                    {searchResults.map((result, i) => (
                      <div key={i} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{result.domain}</p>
                          {result.premium && <span className="text-xs text-purple-600">Premium</span>}
                        </div>
                        <div className="flex items-center gap-4">
                          {result.available ? (
                            <>
                              <span className="text-green-600 font-medium">${pricing.find(p => p.tld === result.tld)?.registration?.usd || '12.99'}/yr</span>
                              <button onClick={() => registerDomain(result.domain)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">Register</button>
                            </>
                          ) : <span className="text-red-500 flex items-center gap-1"><XCircle className="w-4 h-4" />Taken</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700"><h3 className="font-medium text-gray-900 dark:text-white">Pricing</h3></div>
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-500">TLD</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Register</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Renew</th></tr></thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {pricing.slice(0, 10).map((p, i) => (<tr key={i}><td className="px-4 py-3 font-medium text-gray-900 dark:text-white">.{p.tld}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">${p.registration?.usd}/yr</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">${p.renewal?.usd}/yr</td></tr>))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transfer */}
          {activeTab === 'transfer' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transfer Domain to CYBEV</h2>
              <p className="text-gray-500 mb-6">Move your existing domain for easy management</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domain Name</label>
                  <div className="flex gap-2">
                    <input type="text" value={transferDomain} onChange={(e) => setTransferDomain(e.target.value.toLowerCase())} placeholder="example.com" className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    <button onClick={checkTransfer} className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium">Check</button>
                  </div>
                </div>

                {transferCheck && (
                  <div className={`p-4 rounded-lg ${transferCheck.transferable ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200'}`}>
                    {transferCheck.transferable ? (
                      <div className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-600" /><div><p className="font-medium text-green-700">Eligible for transfer</p><p className="text-sm text-green-600 mt-1">{transferCheck.note}</p></div></div>
                    ) : (
                      <div className="flex items-start gap-2"><XCircle className="w-5 h-5 text-red-600" /><div><p className="font-medium text-red-700">Cannot transfer</p><p className="text-sm text-red-600 mt-1">{transferCheck.reason}</p></div></div>
                    )}
                  </div>
                )}

                {transferCheck?.transferable && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">EPP/Auth Code</label>
                      <input type="text" value={transferAuthCode} onChange={(e) => setTransferAuthCode(e.target.value)} placeholder="Auth code from current registrar" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      <p className="text-xs text-gray-500 mt-1">Get this from your current registrar (GoDaddy, Namecheap, etc.)</p>
                    </div>
                    <button onClick={initiateTransfer} disabled={transferring || !transferAuthCode} className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                      {transferring ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}Transfer to CYBEV
                    </button>
                  </>
                )}

                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">How to Transfer</h3>
                  <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    {['Unlock domain at current registrar', 'Get EPP/Auth code', 'Enter domain & code above', 'Approve transfer email', 'Complete in 5-7 days (includes 1 year!)'].map((step, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">{i + 1}</span>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DNS Modal */}
        {showDNSModal && selectedDomain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">DNS Settings - {selectedDomain.domain}</h3>
                <button onClick={() => setShowDNSModal(false)} className="text-gray-500">✕</button>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-500">Choose a preset to quickly configure your domain</p>
                <div className="grid grid-cols-2 gap-2">
                  {dnsPresets.map(preset => (
                    <button key={preset.id} onClick={() => { setSelectedPreset(preset); setPresetInputs({}); }} className={`p-3 text-left rounded-lg border transition-colors ${selectedPreset?.id === preset.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'}`}>
                      <span className="text-2xl">{PRESET_ICONS[preset.id] || '⚙️'}</span>
                      <p className="font-medium text-gray-900 dark:text-white text-sm mt-1">{preset.name}</p>
                    </button>
                  ))}
                </div>
                {selectedPreset?.requiresInput?.length > 0 && (
                  <div className="space-y-3 pt-4 border-t dark:border-gray-700">
                    {selectedPreset.requiresInput.map(input => (
                      <div key={input}><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{input.replace(/([A-Z])/g, ' $1')}</label><input type="text" value={presetInputs[input] || ''} onChange={(e) => setPresetInputs({ ...presetInputs, [input]: e.target.value })} className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" /></div>
                    ))}
                  </div>
                )}
                <button onClick={() => applyDNSPreset(selectedPreset?.id)} disabled={!selectedPreset} className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50">Apply {selectedPreset?.name || 'Preset'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Renew Modal */}
        {showRenewModal && selectedDomain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
              <div className="p-4 border-b dark:border-gray-700"><h3 className="font-semibold text-gray-900 dark:text-white">Renew {selectedDomain.domain}</h3></div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between py-3 border-b dark:border-gray-700"><span className="text-gray-600">Current Expiry</span><span className="font-medium text-gray-900 dark:text-white">{new Date(selectedDomain.expiresAt).toLocaleDateString()}</span></div>
                <div className="flex items-center justify-between py-3"><span className="text-gray-600">Renewal Price</span><span className="font-bold text-xl text-purple-600">${selectedDomain.pricing?.renewal || '14.99'}/year</span></div>
                <div className="flex gap-3">
                  <button onClick={() => setShowRenewModal(false)} className="flex-1 py-3 border dark:border-gray-600 rounded-lg font-medium">Cancel</button>
                  <button onClick={() => renewDomain(selectedDomain._id, 1)} className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium">Renew 1 Year</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Out Modal */}
        {showTransferOutModal && selectedDomain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
              <div className="p-4 border-b dark:border-gray-700"><h3 className="font-semibold text-gray-900 dark:text-white">Transfer Out - {selectedDomain.domain}</h3></div>
              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-500">To transfer to another registrar:</p>
                <div className="space-y-3">
                  <button onClick={() => toggleDomainLock(selectedDomain._id, false)} disabled={!selectedDomain.registrar?.locked} className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${selectedDomain.registrar?.locked ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700'}`}>
                    {selectedDomain.registrar?.locked ? <><Unlock className="w-5 h-5" />Step 1: Unlock Domain</> : <><Check className="w-5 h-5" />Domain Unlocked ✓</>}
                  </button>
                  <button onClick={() => getTransferAuthCode(selectedDomain._id)} disabled={selectedDomain.registrar?.locked} className="w-full py-3 bg-purple-100 text-purple-700 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"><Copy className="w-5 h-5" />Step 2: Get Auth Code</button>
                </div>
                <p className="text-xs text-gray-500">Enter auth code at new registrar to complete transfer.</p>
                <button onClick={() => setShowTransferOutModal(false)} className="w-full py-2 border dark:border-gray-600 rounded-lg font-medium">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
