// ============================================
// FILE: src/pages/api/web-stories-sitemap.xml.js
// Proxies web stories sitemap from backend
// Served at: cybev.io/api/web-stories-sitemap.xml
// ============================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cybev.io';

export default async function handler(req, res) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const resp = await fetch(`${API_URL}/api/web-stories?limit=500`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    const data = await resp.json();
    const stories = data.stories || [];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const story of stories) {
      const loc = `${API_URL}/api/web-stories/${story.id}`;
      const lastmod = story.createdAt ? new Date(story.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${loc.replace(/&/g, '&amp;')}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`;
    }

    xml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    res.status(200).send(xml);
  } catch (err) {
    // Fallback empty sitemap
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>';
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  }
}
