// ============================================
// FILE: src/pages/api/sitemap.xml.js
// Dynamic Sitemap Generator
// VERSION: 2.0
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
const SITE_URL = 'https://cybev.io';

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/feed', priority: 0.9, changefreq: 'hourly' },
  { url: '/explore', priority: 0.9, changefreq: 'hourly' },
  { url: '/live', priority: 0.9, changefreq: 'hourly' },
  { url: '/tv', priority: 0.8, changefreq: 'hourly' },
  { url: '/blog', priority: 0.9, changefreq: 'daily' },
  { url: '/blog/create', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/ai-generator', priority: 0.8, changefreq: 'monthly' },
  { url: '/marketplace', priority: 0.8, changefreq: 'daily' },
  { url: '/nft', priority: 0.7, changefreq: 'daily' },
  { url: '/staking', priority: 0.6, changefreq: 'weekly' },
  { url: '/groups', priority: 0.7, changefreq: 'daily' },
  { url: '/search', priority: 0.6, changefreq: 'daily' },
  { url: '/auth/login', priority: 0.5, changefreq: 'monthly' },
  { url: '/auth/signup', priority: 0.6, changefreq: 'monthly' },
  { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { url: '/terms', priority: 0.3, changefreq: 'yearly' },
];

async function fetchDynamicContent() {
  const results = {
    blogs: [],
    profiles: [],
    posts: []
  };

  try {
    // Fetch recent blogs (public)
    const blogsRes = await fetch(`${API_URL}/api/blog?limit=100&status=published`);
    if (blogsRes.ok) {
      const blogsData = await blogsRes.json();
      results.blogs = (blogsData.blogs || blogsData || []).slice(0, 100);
    }
  } catch (e) {
    console.log('Sitemap: Could not fetch blogs');
  }

  try {
    // Fetch user profiles (public)
    const usersRes = await fetch(`${API_URL}/api/users?limit=100`);
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      results.profiles = (usersData.users || usersData || []).slice(0, 100);
    }
  } catch (e) {
    console.log('Sitemap: Could not fetch users');
  }

  return results;
}

function generateSitemapXML(staticPages, dynamicContent) {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // Static pages
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Blog pages
  dynamicContent.blogs.forEach(blog => {
    const lastmod = blog.updatedAt || blog.createdAt || today;
    const date = new Date(lastmod).toISOString().split('T')[0];
    xml += `  <url>
    <loc>${SITE_URL}/blog/${blog._id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
    
    // Add image if available
    if (blog.featuredImage) {
      xml += `
    <image:image>
      <image:loc>${blog.featuredImage}</image:loc>
      <image:title>${escapeXml(blog.title || 'Blog post')}</image:title>
    </image:image>`;
    }
    
    xml += `
  </url>
`;
  });

  // Profile pages
  dynamicContent.profiles.forEach(user => {
    if (user.username) {
      xml += `  <url>
    <loc>${SITE_URL}/profile/${user.username}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }
  });

  xml += `</urlset>`;
  return xml;
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

export default async function handler(req, res) {
  try {
    const dynamicContent = await fetchDynamicContent();
    const sitemap = generateSitemapXML(staticPages, dynamicContent);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Return basic sitemap on error
    const basicSitemap = generateSitemapXML(staticPages, { blogs: [], profiles: [], posts: [] });
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(basicSitemap);
  }
}
