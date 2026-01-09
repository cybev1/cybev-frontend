// ============================================
// FILE: src/pages/studio/sites/[id]/settings.jsx
// Site Settings - Domain, SEO, Publish options
// VERSION: 6.4.2
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ArrowLeft, Save, Globe, Settings, Search, Shield, Trash2,
  ExternalLink, Copy, Check, Loader2, AlertCircle, Eye,
  Link as LinkIcon, Image as ImageIcon, Code, Zap, X
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function SiteSettings() {
  const router = useRouter();
  const { id } = router.query;

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [settings, setSettings] = useState({
    name: '',
    description: '',
    subdomain: '',
    customDomain: '',
    favicon: '',
    ogImage: '',
    ogTitle: '',
    ogDescription: '',
    googleAnalytics: '',
    customHead: '',
    customCss: '',
    password: '',
    isPublished: false
  });

  const [subdomainAvailable, setSubdomainAvailable] = useState(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    if (id) {
      fetchSite();
    }
  }, [id]);

  const fetchSite = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sites/${id}`, getAuth());
      const data = await res.json();
      
      if (data.ok || data.site) {
        const siteData = data.site || data;
        setSite(siteData);
        setSettings({
          name: siteData.name || '',
          description: siteData.description || '',
          subdomain: siteData.subdomain || '',
          customDomain: siteData.customDomain || '',
          favicon: siteData.favicon || '',
          ogImage: siteData.ogImage || '',
          ogTitle: siteData.ogTitle || siteData.name || '',
          ogDescription: siteData.ogDescription || siteData.description || '',
          googleAnalytics: siteData.googleAnalytics || '',
          customHead: siteData.customHead || '',
          customCss: siteData.customCss || '',
          password: siteData.password || '',
          isPublished: siteData.status === 'published'
        });
      }
    } catch (err) {
      console.error('Fetch site error:', err);
    }
    setLoading(false);
  };

  const checkSubdomain = async (subdomain) => {
    if (!subdomain || subdomain.length < 3 || subdomain === site?.subdomain) {
      setSubdomainAvailable(null);
      return;
    }

    setCheckingSubdomain(true);
    try {
      const res = await fetch(`${API_URL}/api/sites/domain/check?subdomain=${subdomain}`, getAuth());
      const data = await res.json();
      setSubdomainAvailable(data.available !== false);
    } catch (err) {
      setSubdomainAvailable(true);
    }
    setCheckingSubdomain(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/sites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuth().headers
        },
        body: JSON.stringify({
          ...settings,
          status: settings.isPublished ? 'published' : 'draft'
        })
      });

      const data = await res.json();
      if (data.ok || data.site) {
        // Update subdomain if changed
        if (settings.subdomain !== site.subdomain) {
          await fetch(`${API_URL}/api/sites/${id}/subdomain`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuth().headers
            },
            body: JSON.stringify({ subdomain: settings.subdomain })
          });
        }
      }
    } catch (err) {
      console.error('Save settings error:', err);
    }
    setSaving(false);
  };

  const deleteSite = async () => {
    setDeleting(true);
    try {
      await fetch(`${API_URL}/api/sites/${id}`, {
        method: 'DELETE',
        ...getAuth()
      });
      router.push('/studio');
    } catch (err) {
      console.error('Delete site error:', err);
    }
    setDeleting(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://${settings.subdomain}.cybev.io`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const TABS = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'domain', name: 'Domain', icon: Globe },
    { id: 'seo', name: 'SEO', icon: Search },
    { id: 'advanced', name: 'Advanced', icon: Code },
    { id: 'danger', name: 'Danger Zone', icon: AlertCircle }
  ];

  return (
    <>
      <Head>
        <title>Settings - {site?.name || 'Site'} - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/studio/sites/${id}/edit`}>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
                  <p className="text-sm text-gray-500">{site?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://${settings.subdomain}.cybev.io`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Site
                </a>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-48 flex-shrink-0">
              <nav className="space-y-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={settings.description}
                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                      <div className="flex gap-3">
                        {settings.favicon && (
                          <img src={settings.favicon} alt="Favicon" className="w-10 h-10 rounded border" />
                        )}
                        <input
                          type="text"
                          value={settings.favicon}
                          onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Publish Site</h3>
                        <p className="text-sm text-gray-500">Make your site visible to everyone</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.isPublished}
                          onChange={(e) => setSettings({ ...settings, isPublished: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Domain Settings */}
              {activeTab === 'domain' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Subdomain</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Site URL</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                          <input
                            type="text"
                            value={settings.subdomain}
                            onChange={(e) => {
                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                              setSettings({ ...settings, subdomain: value });
                              checkSubdomain(value);
                            }}
                            className="flex-1 px-4 py-2 bg-transparent focus:outline-none"
                          />
                          <span className="px-3 text-gray-500 bg-gray-100 py-2">.cybev.io</span>
                        </div>
                        <button
                          onClick={copyUrl}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
                        </button>
                      </div>
                      {checkingSubdomain && (
                        <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Checking availability...
                        </p>
                      )}
                      {!checkingSubdomain && subdomainAvailable === true && settings.subdomain !== site?.subdomain && (
                        <p className="mt-2 text-sm text-green-600">✓ This subdomain is available</p>
                      )}
                      {!checkingSubdomain && subdomainAvailable === false && (
                        <p className="mt-2 text-sm text-red-600">This subdomain is taken</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Custom Domain</h2>
                        <p className="text-sm text-gray-500">Connect your own domain name</p>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                        Pro Feature
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
                      <input
                        type="text"
                        value={settings.customDomain}
                        onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                        placeholder="www.yourdomain.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Point your domain's CNAME record to <code className="bg-gray-100 px-1 rounded">sites.cybev.io</code>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Settings */}
              {activeTab === 'seo' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">SEO & Social Preview</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                      <input
                        type="text"
                        value={settings.ogTitle}
                        onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                        placeholder="Page title for search engines"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">{settings.ogTitle.length}/60 characters recommended</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                      <textarea
                        value={settings.ogDescription}
                        onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                        placeholder="Brief description for search results"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                      <p className="mt-1 text-sm text-gray-500">{settings.ogDescription.length}/160 characters recommended</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Social Preview Image</label>
                      {settings.ogImage && (
                        <img src={settings.ogImage} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-3" />
                      )}
                      <input
                        type="text"
                        value={settings.ogImage}
                        onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">Recommended size: 1200x630 pixels</p>
                    </div>

                    {/* Preview Card */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-3">Social Preview</p>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md">
                        {settings.ogImage ? (
                          <img src={settings.ogImage} alt="" className="w-full h-32 object-cover" />
                        ) : (
                          <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        <div className="p-3">
                          <p className="text-sm text-gray-500">{settings.subdomain}.cybev.io</p>
                          <p className="font-semibold text-gray-900">{settings.ogTitle || settings.name}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{settings.ogDescription || settings.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Analytics</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                      <input
                        type="text"
                        value={settings.googleAnalytics}
                        onChange={(e) => setSettings({ ...settings, googleAnalytics: e.target.value })}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Custom Code</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Head Code</label>
                        <textarea
                          value={settings.customHead}
                          onChange={(e) => setSettings({ ...settings, customHead: e.target.value })}
                          placeholder="<script>...</script>"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm resize-none"
                        />
                        <p className="mt-1 text-sm text-gray-500">Added before &lt;/head&gt;</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
                        <textarea
                          value={settings.customCss}
                          onChange={(e) => setSettings({ ...settings, customCss: e.target.value })}
                          placeholder=".my-class { color: red; }"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Password Protection</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Password</label>
                      <input
                        type="password"
                        value={settings.password}
                        onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                        placeholder="Leave empty for public access"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">Visitors will need this password to view your site</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              {activeTab === 'danger' && (
                <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                  <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
                  <p className="text-gray-500 mb-6">These actions cannot be undone</p>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Delete Website</h3>
                        <p className="text-sm text-gray-500">Permanently delete this website and all its content</p>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                      >
                        Delete Site
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Website?</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{site?.name}</strong>? This action cannot be undone and all content will be permanently lost.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={deleteSite}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
