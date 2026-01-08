// ============================================
// FILE: src/pages/api/sitemap.js
// Dynamic Sitemap Generator
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cybev.io';

export default async function handler(req, res) {
  try {
    // Fetch recent blogs
    const blogsRes = await fetch(`${API_URL}/api/blogs?limit=100&status=published`).catch(() => null);
    const blogsData = blogsRes ? await blogsRes.json() : { blogs: [] };
    const blogs = blogsData.blogs || [];

    // Fetch users for profiles
    const usersRes = await fetch(`${API_URL}/api/users?limit=50`).catch(() => null);
    const usersData = usersRes ? await usersRes.json() : { users: [] };
    const users = usersData.users || [];

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/feed', priority: '0.9', changefreq: 'hourly' },
      { url: '/explore', priority: '0.8', changefreq: 'daily' },
      { url: '/live', priority: '0.8', changefreq: 'hourly' },
      { url: '/tv', priority: '0.8', changefreq: 'hourly' },
      { url: '/auth/login', priority: '0.6', changefreq: 'monthly' },
      { url: '/auth/signup', priority: '0.6', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms', priority: '0.3', changefreq: 'yearly' },
      { url: '/about', priority: '0.5', changefreq: 'monthly' }
    ];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticPages.map(page => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${blogs.map(blog => `
  <url>
    <loc>${SITE_URL}/blog/${blog._id}</loc>
    <lastmod>${new Date(blog.updatedAt || blog.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${blog.featuredImage ? `
    <image:image>
      <image:loc>${blog.featuredImage}</image:loc>
      <image:title>${escapeXml(blog.title)}</image:title>
    </image:image>` : ''}
  </url>`).join('')}
  ${users.map(user => `
  <url>
    <loc>${SITE_URL}/profile/${user.username || user._id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
}

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
