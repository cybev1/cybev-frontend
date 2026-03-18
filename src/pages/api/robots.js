// ============================================
// FILE: src/pages/api/robots.js
// Dynamic robots.txt generator
// VERSION: 2.0 — Fixed sitemap URL, added watch-party
// ============================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cybev.io';

export default function handler(req, res) {
  const robotsTxt = `# CYBEV robots.txt
User-agent: *
Allow: /
Allow: /blog/*
Allow: /profile/*
Allow: /live/*
Allow: /watch-party/*
Allow: /feed
Allow: /explore
Allow: /tv
Allow: /vlog/*
Allow: /church
Allow: /marketplace

# Disallow private/auth pages from indexing
Disallow: /api/
Disallow: /admin/*
Disallow: /settings/*
Disallow: /messages/*
Disallow: /notifications
Disallow: /wallet
Disallow: /earnings
Disallow: /auth/callback
Disallow: /auth/oauth-callback
Disallow: /_next/
Disallow: /404
Disallow: /500
Disallow: /onboarding

# Crawl delay for politeness
Crawl-delay: 1

# Sitemap location
Sitemap: ${SITE_URL}/api/sitemap.xml

# Google specific
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Bing specific
User-agent: Bingbot
Allow: /
Crawl-delay: 1
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.status(200).send(robotsTxt);
}
