// ============================================
// FILE: src/pages/api/sitemap.xml.js
// Dynamic Sitemap for Google Search Console
// VERSION: 2.0 — Uses direct fetch, not client-side API
// ============================================
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cybev.io';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function generateSiteMap(blogs, watchParties) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/2005/Atom" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <!-- Static pages -->
  <url><loc>${SITE_URL}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/feed</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/blog</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/watch-party</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/explore</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/live</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/tv</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/vlog</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/marketplace</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/church</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/auth/signup</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/auth/login</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${SITE_URL}/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <!-- Blog posts -->
${blogs.map(b => `  <url>
    <loc>${SITE_URL}/blog/${b.slug || b._id}</loc>
    <lastmod>${new Date(b.updatedAt || b.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${b.featuredImage ? `
    <image:image><image:loc>${b.featuredImage.replace(/&/g, '&amp;')}</image:loc><image:title>${(b.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title></image:image>` : ''}
  </url>`).join('\n')}
  <!-- Watch parties -->
${watchParties.map(wp => `  <url>
    <loc>${SITE_URL}/watch-party/${wp._id}</loc>
    <lastmod>${new Date(wp.updatedAt || wp.createdAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>${wp.coverImage ? `
    <image:image><image:loc>${wp.coverImage.replace(/&/g, '&amp;')}</image:loc><image:title>${(wp.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title></image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;
}

export default async function handler(req, res) {
  try {
    // Fetch blogs directly from backend API (not client-side lib)
    let blogs = [];
    let watchParties = [];

    try {
      const blogRes = await fetch(`${API_URL}/api/blogs?limit=1000&status=published`);
      if (blogRes.ok) {
        const data = await blogRes.json();
        blogs = data.blogs || data.data?.blogs || [];
      }
    } catch (e) { console.error('Sitemap blog fetch error:', e.message); }

    try {
      const wpRes = await fetch(`${API_URL}/api/watch-party?status=all&limit=200`);
      if (wpRes.ok) {
        const data = await wpRes.json();
        watchParties = (data.parties || []).filter(p => p.status === 'live' || p.status === 'ended');
      }
    } catch (e) { console.error('Sitemap watch-party fetch error:', e.message); }

    const sitemap = generateSiteMap(blogs, watchParties);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // Return minimal valid sitemap even on error
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}</loc><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/feed</loc><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/blog</loc><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/watch-party</loc><priority>0.9</priority></url>
</urlset>`);
  }
}
