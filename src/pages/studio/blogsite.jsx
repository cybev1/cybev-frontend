import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '../../components/Layout/AppLayout';
import { blogSiteAPI } from '../../lib/api';
import { blogTemplates } from '../../data/blogTemplates';

function slugify(input = '') {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export default function BlogSiteStudio() {
  const router = useRouter();
  const preselectTemplate = typeof router.query.template === 'string' ? router.query.template : '';

  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [templateKey, setTemplateKey] = useState(preselectTemplate || 'minimal');

  const templatesByCategory = useMemo(() => {
    const grouped = {};
    for (const t of blogTemplates) {
      grouped[t.category] = grouped[t.category] || [];
      grouped[t.category].push(t);
    }
    return grouped;
  }, []);

  async function loadMySites() {
    setLoading(true);
    setError('');
    try {
      const res = await blogSiteAPI.mySites();
      setSites(res.data?.sites || []);
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load your blog sites. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMySites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (preselectTemplate) setTemplateKey(preselectTemplate);
  }, [preselectTemplate]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    const finalSlug = slugify(slug || name);
    try {
      const res = await blogSiteAPI.create({
        name,
        slug: finalSlug,
        description,
        templateKey,
      });
      const created = res.data?.site;
      await loadMySites();
      if (created?.slug) {
        router.push(`/blogsite/${created.slug}`);
      }
    } catch (e2) {
      setError(e2?.response?.data?.error || 'Failed to create blog site.');
    }
  }

  return (
    <AppLayout>
      <Head>
        <title>Blog Site Studio • CYBEV</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Blog Site Studio</h1>
            <p className="text-sm opacity-80">
              Create your blog site (template + slug). Then publish posts to it.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/blog/create" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">
              Write a Blog Post
            </Link>
            <Link href="/feed" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">
              Go to Feed
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <h2 className="font-semibold mb-3">Create a new site</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Site name</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. CYBEV Tech & Ministry"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Slug</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="e.g. cybev-tech"
                />
                <p className="text-xs opacity-70 mt-1">
                  Your public URL will be <span className="font-mono">/blogsite/{slug || 'your-slug'}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm mb-1">Short description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 min-h-[88px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this blog about?"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Template</label>
                <select
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10"
                  value={templateKey}
                  onChange={(e) => setTemplateKey(e.target.value)}
                >
                  {Object.keys(templatesByCategory).map((cat) => (
                    <optgroup key={cat} label={cat}>
                      {templatesByCategory[cat].map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <div className="mt-2 text-xs opacity-75">
                  Preview templates in <Link className="underline" href="/blog/templates">Blog Templates</Link>.
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90"
              >
                Create Blog Site
              </button>
            </form>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">My sites</h2>
              <button
                onClick={loadMySites}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="mt-4 text-sm opacity-80">Loading…</div>
            ) : sites.length === 0 ? (
              <div className="mt-4 text-sm opacity-80">
                No sites yet. Create your first blog site on the left.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {sites.map((s) => (
                  <div key={s._id} className="p-3 rounded-lg border border-white/10 bg-black/10">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs opacity-75 font-mono">/blogsite/{s.slug}</div>
                        {s.description ? <div className="text-sm opacity-80 mt-1">{s.description}</div> : null}
                        <div className="text-xs opacity-70 mt-2">
                          Template: <span className="font-mono">{s.templateKey}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/blogsite/${s.slug}`}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-sm text-center"
                        >
                          Open
                        </Link>
                        <Link
                          href={`/blog/create?site=${encodeURIComponent(s._id)}`}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-sm text-center"
                        >
                          Write Post
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 rounded-xl border border-white/10 bg-white/5">
          <h3 className="font-semibold mb-2">Next step: connect a domain</h3>
          <p className="text-sm opacity-80">
            If you want a custom domain, go to{' '}
            <Link className="underline" href="/settings/domain">Domain Settings</Link>.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
