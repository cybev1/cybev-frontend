import { blogAPI } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cybev.io';

function generateSiteMap(blogs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     <url>
       <loc>${SITE_URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${SITE_URL}/blog</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>hourly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${SITE_URL}/rewards/dashboard</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.7</priority>
     </url>
     <!-- Dynamic blog pages -->
     ${blogs
       .map((blog) => {
         return `
       <url>
           <loc>${`${SITE_URL}/blog/${blog._id}`}</loc>
           <lastmod>${new Date(blog.updatedAt || blog.createdAt).toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export default async function handler(req, res) {
  try {
    // Fetch all published blogs
    const response = await blogAPI.getBlogs({ limit: 1000, status: 'published' });
    const blogs = response.data.ok ? response.data.blogs : [];

    // Generate sitemap
    const sitemap = generateSiteMap(blogs);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).end();
  }
}
