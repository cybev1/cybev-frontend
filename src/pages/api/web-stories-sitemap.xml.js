// ============================================
// FILE: src/pages/api/web-stories-sitemap.xml.js
// Web Stories Sitemap — same pattern as working sitemap.xml.js
// Fetches blogs directly from backend API (proven to work)
// VERSION: 2.0
// ============================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  let blogs = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const blogRes = await fetch(`${API_URL}/api/blogs?limit=500&status=published`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (blogRes.ok) {
      const data = await blogRes.json();
      blogs = (data.blogs || data.data || []).filter(b =>
        b.coverImage || b.featuredImage || b.thumbnail
      );
    }
  } catch (err) {
    console.error('Web stories sitemap fetch error:', err.message);
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const blog of blogs) {
    const storyUrl = `${API_URL}/api/web-stories/${blog._id}`;
    const lastmod = new Date(blog.updatedAt || blog.createdAt || Date.now()).toISOString().split('T')[0];
    xml += `  <url><loc>${esc(storyUrl)}</loc><lastmod>${lastmod}</lastmod></url>\n`;
  }

  xml += `</urlset>`;

  res.status(200).send(xml);
}
