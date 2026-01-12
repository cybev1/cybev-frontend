import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import { domainAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  Globe, CheckCircle, XCircle, AlertCircle, Copy,
  ExternalLink, Sparkles, ArrowRight, RefreshCw
} from 'lucide-react';

export default function DomainSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [domainStatus, setDomainStatus] = useState(null);
  const [domainInput, setDomainInput] = useState('');
  const [checkResult, setCheckResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to manage domains');
      router.push('/auth/login');
      return;
    }
    fetchDomainStatus();
  }, [router]);

  const fetchDomainStatus = async () => {
    setLoading(true);
    try {
      const response = await domainAPI.getDomainStatus();
      if (response.data.ok) {
        setDomainStatus(response.data);
      }
    } catch (error) {
      console.error('Failed to load domain status');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckDomain = async () => {
    if (!domainInput || !domainInput.includes('.')) {
      toast.error('Please enter a valid domain (e.g., example.com)');
      return;
    }

    setChecking(true);
    setCheckResult(null);
    try {
      const response = await domainAPI.checkDomain(domainInput);
      if (response.data.ok || response.data.available) {
        setCheckResult(response.data);
        toast.success('Domain checked successfully!');
      } else {
        toast.error(response.data.error || 'Domain check failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to check domain');
    } finally {
      setChecking(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!domainInput) {
      toast.error('Please enter a domain first');
      return;
    }

    setVerifying(true);
    try {
      const response = await domainAPI.verifyDomain(domainInput);
      if (response.data.ok && response.data.verified) {
        toast.success(`🎉 Domain verified! You earned ${response.data.tokensEarned} tokens!`);
        setDomainInput('');
        setCheckResult(null);
        fetchDomainStatus();
      } else {
        toast.error(response.data.error || 'Domain verification failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to verify domain');
    } finally {
      setVerifying(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!confirm('Are you sure you want to remove your custom domain?')) {
      return;
    }

    setRemoving(true);
    try {
      const response = await domainAPI.removeDomain();
      if (response.data.ok) {
        toast.success('Domain removed successfully');
        fetchDomainStatus();
      }
    } catch (error) {
      toast.error('Failed to remove domain');
    } finally {
      setRemoving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-900">Custom Domain</h1>
            </div>
            <p className="text-gray-600">Connect your own domain and earn 200 tokens!</p>
          </div>
        </div>

        {/* Reward Banner */}
        {!domainStatus?.hasCustomDomain && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-xl p-6 flex items-center gap-4">
              <Sparkles className="w-12 h-12 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="text-gray-900 font-semibold text-lg">Earn 200 Tokens!</h3>
                <p className="text-gray-700">Connect your custom domain and get rewarded instantly.</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          {/* Current Domain Status */}
          {domainStatus?.hasCustomDomain ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Custom Domain</h2>
                  <p className="text-gray-600">Your domain is connected and active</p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  domainStatus.verified 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>
                  {domainStatus.verified ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-semibold">Needs Setup</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-mono text-lg">{domainStatus.domain}</span>
                  <a
                    href={`https://${domainStatus.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit
                  </a>
                </div>
              </div>

              {domainStatus.needsReconfiguration && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">DNS Configuration Error</h4>
                      <p className="text-red-700 text-sm">Your domain's DNS records don't point to our server. Please check your configuration below.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={fetchDomainStatus}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Status
                </button>
                <button
                  onClick={handleRemoveDomain}
                  disabled={removing}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all disabled:opacity-50 border border-red-200"
                >
                  {removing ? 'Removing...' : 'Remove Domain'}
                </button>
              </div>
            </div>
          ) : (
            /* Add New Domain */
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect Your Domain</h2>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Enter your domain
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value.toLowerCase().trim())}
                    placeholder="example.com"
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleCheckDomain}
                    disabled={checking}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-gray-900 rounded-lg transition-all disabled:opacity-50 font-semibold"
                  >
                    {checking ? 'Checking...' : 'Check'}
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Enter your domain without http:// or www (e.g., example.com)
                </p>
              </div>

              {/* Check Result */}
              {checkResult && (
                <div className={`rounded-lg p-6 mb-6 ${
                  checkResult.available 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    {checkResult.available ? (
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${
                        checkResult.available ? 'text-blue-900' : 'text-red-900'
                      }`}>
                        {checkResult.available ? 'Domain Available!' : 'Domain Not Available'}
                      </h3>
                      <p className={checkResult.available ? 'text-blue-700' : 'text-red-700'}>
                        {checkResult.error || 'This domain is ready to be connected.'}
                      </p>
                    </div>
                  </div>

                  {checkResult.available && checkResult.requiredConfig && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">DNS Configuration Required:</h4>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="grid grid-cols-3 gap-4 text-sm mb-2 font-semibold text-gray-700">
                            <div>Type</div>
                            <div>Name</div>
                            <div>Value</div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="font-mono">{checkResult.requiredConfig.type}</div>
                            <div className="font-mono">{checkResult.requiredConfig.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{checkResult.requiredConfig.value}</span>
                              <button
                                onClick={() => copyToClipboard(checkResult.requiredConfig.value)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Copy className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Setup Instructions:
                        </h4>
                        <ol className="space-y-2 text-blue-800 text-sm">
                          {checkResult.requiredConfig.instructions?.map((instruction, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="font-semibold">{idx + 1}.</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <button
                        onClick={handleVerifyDomain}
                        disabled={verifying}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-gray-900 rounded-lg transition-all disabled:opacity-50 font-semibold"
                      >
                        {verifying ? 'Verifying...' : 'Verify Domain'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Benefits */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Connect a Custom Domain?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Professional Branding</h4>
                  <p className="text-gray-600 text-sm">Use your own domain for a professional look</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Earn 200 Tokens</h4>
                  <p className="text-gray-600 text-sm">Get instant rewards for domain setup</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Full Control</h4>
                  <p className="text-gray-600 text-sm">Own your content and URL</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">SEO Benefits</h4>
                  <p className="text-gray-600 text-sm">Better search engine visibility</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}