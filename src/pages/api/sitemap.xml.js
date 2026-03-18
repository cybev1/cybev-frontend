// ============================================
// FILE: src/pages/api/sitemap.xml.js
// Dynamic Sitemap for Google Search Console
// VERSION: 3.0 — Fixed namespace, timeout, bulletproof
// ============================================
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cybev.io';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateSiteMap(blogs, watchParties) {
  const now = new Date().toISOString();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>${SITE_URL}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/feed</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/blog</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/watch-party</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/explore</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/live</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/tv</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/vlog</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/marketplace</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/church</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/auth/signup</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/auth/login</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${SITE_URL}/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
`;

  for (const b of blogs) {
    const loc = b.slug ? `${SITE_URL}/blog/${esc(b.slug)}` : `${SITE_URL}/blog/${b._id}`;
    const mod = new Date(b.updatedAt || b.createdAt || Date.now()).toISOString();
    xml += `  <url><loc>${loc}</loc><lastmod>${mod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority>`;
    if (b.featuredImage) {
      xml += `<image:image><image:loc>${esc(b.featuredImage)}</image:loc><image:title>${esc(b.title)}</image:title></image:image>`;
    }
    xml += `</url>\n`;
  }

  for (const wp of watchParties) {
    const mod = new Date(wp.updatedAt || wp.createdAt || Date.now()).toISOString();
    xml += `  <url><loc>${SITE_URL}/watch-party/${wp._id}</loc><lastmod>${mod}</lastmod><changefreq>daily</changefreq><priority>0.7</priority>`;
    if (wp.coverImage) {
      xml += `<image:image><image:loc>${esc(wp.coverImage)}</image:loc><image:title>${esc(wp.title)}</image:title></image:image>`;
    }
    xml += `</url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export default async function handler(req, res) {
  // Always return valid XML — never let Google see an error
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  let blogs = [];
  let watchParties = [];

  try {
    // Fetch with 8s timeout (Vercel has 10s limit)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const blogRes = await fetch(`${API_URL}/api/blogs?limit=1000&status=published`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (blogRes.ok) {
      const data = await blogRes.json();
      blogs = data.blogs || data.data?.blogs || [];
    }
  } catch (e) {
    console.error('Sitemap blog fetch:', e.message);
  }

  try {
    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 5000);

    const wpRes = await fetch(`${API_URL}/api/watch-party?status=all&limit=200`, {
      signal: controller2.signal
    });
    clearTimeout(timeout2);

    if (wpRes.ok) {
      const data = await wpRes.json();
      watchParties = (data.parties || []).filter(p => p.status === 'live' || p.status === 'ended');
    }
  } catch (e) {
    console.error('Sitemap wp fetch:', e.message);
  }

  // Always return 200 with valid XML
  res.status(200).send(generateSiteMap(blogs, watchParties));
}
