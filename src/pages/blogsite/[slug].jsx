import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { blogSiteAPI } from '../../lib/api';

export default function BlogSitePublic() {
  const router = useRouter();
  const { slug } = router.query;

  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await blogSiteAPI.getPublicPosts(slug);
        if (!mounted) return;
        setSite(res.data?.site || null);
        setPosts(res.data?.posts || []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.error || 'Failed to load this blog site.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const title = site ? `${site.name} • CYBEV BlogSite` : 'CYBEV BlogSite';

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <header className="border-b border-white/10 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link href="/" className="text-sm opacity-80 hover:opacity-100">← Back to CYBEV</Link>
              <h1 className="text-3xl font-bold mt-2">{site?.name || 'Blog Site'}</h1>
              {site?.description ? <p className="mt-2 opacity-80">{site.description}</p> : null}
              {site?.templateKey ? (
                <p className="mt-2 text-xs opacity-60">
                  Template: <span className="font-mono">{site.templateKey}</span>
                </p>
              ) : null}
            </div>

            <div className="flex gap-2">
              <Link href="/feed" className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-sm">
                Social Feed
              </Link>
              <Link href="/studio/blogsite" className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-sm">
                Creator Studio
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="opacity-80">Loading…</div>
        ) : error ? (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">{error}</div>
        ) : posts.length === 0 ? (
          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <h2 className="font-semibold text-lg">No posts yet</h2>
            <p className="opacity-80 mt-1">This site is live, but no posts have been published to it yet.</p>
            <div className="mt-4">
              <Link href="/blog/create" className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90">
                Write the first post
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <article key={p._id} className="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/7 transition">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">
                    <Link href={`/blog/${p._id}`} className="hover:underline">
                      {p.title}
                    </Link>
                  </h2>
                  <span className="text-xs opacity-60">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                {p.excerpt ? <p className="mt-2 opacity-80">{p.excerpt}</p> : null}
                <div className="mt-3 flex items-center justify-between text-xs opacity-70">
                  <span>
                    {p.author?.displayName || p.author?.username ? `By ${p.author?.displayName || p.author?.username}` : ''}
                  </span>
                  <Link href={`/blog/${p._id}`} className="underline">
                    Read →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 py-6 text-sm opacity-70">
          Powered by CYBEV • BlogSite
        </div>
      </footer>
    </div>
  );
}
