import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { blogSiteAPI } from '../../lib/api';

export default function BlogSetup() {
  const router = useRouter();
  const templateFromQuery = useMemo(() => {
    const t = router.query?.template;
    return typeof t === 'string' ? t : '';
  }, [router.query]);

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [templateId, setTemplateId] = useState('classic');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');

  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');

  const [customDomain, setCustomDomain] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Query can override template selection
    if (templateFromQuery) setTemplateId(templateFromQuery);
  }, [templateFromQuery]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await blogSiteAPI.getMe();
        if (cancelled) return;
        const site = res?.data || res;

        if (site) {
          setSiteName(site.siteName || '');
          setTagline(site.tagline || '');
          setDescription(site.description || '');
          setLogoUrl(site.logoUrl || '');
          setCoverImageUrl(site.coverImageUrl || '');
          setTemplateId(templateFromQuery || site.templateId || 'classic');
          setPrimaryColor(site.theme?.primaryColor || '#3b82f6');
          setFacebook(site.socialLinks?.facebook || '');
          setInstagram(site.socialLinks?.instagram || '');
          setTwitter(site.socialLinks?.twitter || '');
          setYoutube(site.socialLinks?.youtube || '');
          setCustomDomain(site.customDomain || '');
        }
      } catch (e) {
        // If no site exists yet, that's okay.
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [templateFromQuery]);

  const onSave = async () => {
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const payload = {
        siteName: siteName || 'My CYBEV Blog',
        tagline,
        description,
        logoUrl,
        coverImageUrl,
        templateId,
        theme: {
          primaryColor: primaryColor || '#3b82f6',
        },
        socialLinks: {
          facebook,
          instagram,
          twitter,
          youtube,
        },
        customDomain,
      };

      await blogSiteAPI.upsertMe(payload);
      setMessage('Saved ✅');
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const disabled = !loaded || loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Blog Setup</h1>
            <p className="text-gray-300 mt-1">
              Choose a template + add your branding. You can change this anytime.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/blog/preview/${encodeURIComponent(templateId)}`}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500"
            >
              Preview
            </Link>
            <button
              onClick={() => router.push('/blog/templates')}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500"
            >
              Change Template
            </button>
          </div>
        </div>

        {(message || error) && (
          <div
            className={`mb-6 rounded-xl p-4 border ${
              error ? 'border-red-700 bg-red-950/30' : 'border-emerald-700 bg-emerald-950/20'
            }`}
          >
            {error ? <span className="text-red-300">{error}</span> : <span className="text-emerald-200">{message}</span>}
          </div>
        )}

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
            <h2 className="text-xl font-semibold mb-4">Branding</h2>

            <label className="block text-sm text-gray-300 mb-1">Site name</label>
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
              placeholder="CYBEV Blog"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Tagline</label>
                <input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
                  placeholder="Faith • Tech • Cyber Evangelism"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Primary color</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-10 rounded-lg bg-black border border-gray-700 px-2"
                />
              </div>
            </div>

            <label className="block text-sm text-gray-300 mt-4 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2 min-h-[90px]"
              placeholder="What is your blog about?"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Logo URL</label>
                <input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
                  placeholder="https://.../logo.png"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Cover image URL</label>
                <input
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
                  placeholder="https://.../cover.jpg"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
            <h2 className="text-xl font-semibold mb-4">Template</h2>
            <label className="block text-sm text-gray-300 mb-1">Selected template ID</label>
            <input
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
              placeholder="classic"
            />
            <p className="text-xs text-gray-400 mt-2">
              Tip: choose templates from the Templates page for the best experience.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
            <h2 className="text-xl font-semibold mb-4">Social links (optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
                placeholder="Facebook URL"
              />
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
                placeholder="Instagram URL"
              />
              <input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
                placeholder="X / Twitter URL"
              />
              <input
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
                placeholder="YouTube URL"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
            <h2 className="text-xl font-semibold mb-4">Domain (optional)</h2>
            <label className="block text-sm text-gray-300 mb-1">Custom domain</label>
            <input
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="w-full rounded-lg bg-black border border-gray-700 px-3 py-2"
              placeholder="blog.yourdomain.com"
            />
            <p className="text-xs text-gray-400 mt-2">
              This saves your preference only. Actual DNS verification is handled in Domain Settings.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={onSave}
              disabled={disabled}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save settings'}
            </button>
            <Link
              href="/blog/create"
              className="px-5 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-center"
            >
              Create your first post
            </Link>
            <Link
              href="/blog/builder"
              className="px-5 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-center"
            >
              Open Blog Builder
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
