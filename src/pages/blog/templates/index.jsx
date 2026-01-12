import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '../../../components/Layout/AppLayout';
import { blogTemplates } from '../../../data/blogTemplates';

export default function BlogTemplatesIndex() {
  const [q, setQ] = useState('');

  const grouped = useMemo(() => {
    const by = {};
    const qq = q.trim().toLowerCase();
    for (const t of blogTemplates) {
      const hay = `${t.name} ${t.category} ${t.id}`.toLowerCase();
      if (qq && !hay.includes(qq)) continue;
      by[t.category] = by[t.category] || [];
      by[t.category].push(t);
    }
    return by;
  }, [q]);

  return (
    <AppLayout>
      <Head>
        <title>Blog Templates • CYBEV</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Blog Templates</h1>
            <p className="text-sm opacity-80">
              Choose a template, preview it, then launch your blog site.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/studio/blogsite"
              className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90"
            >
              Create Blog Site
            </Link>
            <Link
              href="/studio"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-gray-200"
            >
              Studio
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <input
            className="w-full px-4 py-3 rounded-xl bg-gray-900/20 border border-gray-200"
            placeholder="Search templates… (e.g. news, ministry, cnn)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="mt-8 space-y-8">
          {Object.keys(grouped).length === 0 ? (
            <div className="p-6 rounded-xl border border-gray-200 bg-white/5 opacity-80">
              No templates match your search.
            </div>
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <section key={cat}>
                <h2 className="text-lg font-semibold mb-3">{cat}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl border border-gray-200 bg-white/5">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs opacity-70 mt-1 font-mono">{t.id}</div>

                      <div className="mt-4 flex gap-2">
                        <Link
                          href={t.href}
                          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-gray-200 text-sm"
                        >
                          Preview
                        </Link>
                        <Link
                          href={`/studio/blogsite?template=${encodeURIComponent(t.id)}`}
                          className="px-3 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90 text-sm"
                        >
                          Use Template
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
