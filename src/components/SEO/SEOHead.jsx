// ============================================
// FILE: src/components/SEO/SEOHead.jsx
// Reusable SEO Component with Open Graph & Twitter
// VERSION: 1.0
// ============================================

import Head from 'next/head';

const SITE_NAME = 'CYBEV';
const DEFAULT_DESCRIPTION = 'CYBEV - The Web3 Social Blogging Platform. Create, share, and monetize your content with AI-powered tools, live streaming, and cryptocurrency rewards.';
const DEFAULT_IMAGE = 'https://cybev.io/og-image.png';
const SITE_URL = 'https://cybev.io';

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  article = null,
  noindex = false,
  keywords = [],
  author = null,
  publishedTime = null,
  modifiedTime = null
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image?.startsWith('http') ? image : `${SITE_URL}${image}`;
  
  const defaultKeywords = [
    'CYBEV', 'social media', 'blogging', 'Web3', 'cryptocurrency',
    'content creation', 'live streaming', 'NFT', 'tokens', 'creator economy'
  ];
  const allKeywords = [...new Set([...defaultKeywords, ...keywords])].join(', ');

  // Structured data for articles
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: fullImage,
    author: {
      '@type': 'Person',
      name: author || 'CYBEV User'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    }
  } : null;

  // Organization schema
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/cybev_io',
      'https://facebook.com/cybev',
      'https://instagram.com/cybev_io'
    ]
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      {author && <meta name="author" content={author} />}
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific OG tags */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@cybev_io" />
      {author && <meta name="twitter:creator" content={`@${author}`} />}
      
      {/* PWA & Mobile */}
      <meta name="theme-color" content="#7c3aed" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
    </Head>
  );
}

// Preset configurations for common pages
export const SEOPresets = {
  home: {
    title: 'Web3 Social Blogging Platform',
    description: 'Create, share, and monetize your content with AI-powered tools, live streaming, and cryptocurrency rewards. Join the future of social blogging.',
    url: '/'
  },
  feed: {
    title: 'Feed',
    description: 'Discover the latest posts, blogs, and live streams from creators you follow on CYBEV.',
    url: '/feed'
  },
  explore: {
    title: 'Explore',
    description: 'Explore trending content, discover new creators, and find communities on CYBEV.',
    url: '/explore'
  },
  live: {
    title: 'Live Streams',
    description: 'Watch live streams from creators, interact in real-time, and support your favorites with donations.',
    url: '/live'
  },
  blog: {
    title: 'Blog',
    description: 'Read and create blog posts with AI-powered writing tools. Monetize your content with Web3 features.',
    url: '/blog'
  },
  marketplace: {
    title: 'Marketplace',
    description: 'Buy, sell, and trade NFTs and digital assets on the CYBEV marketplace.',
    url: '/marketplace'
  },
  login: {
    title: 'Login',
    description: 'Sign in to your CYBEV account to create content, connect with others, and earn rewards.',
    url: '/auth/login',
    noindex: true
  },
  signup: {
    title: 'Sign Up',
    description: 'Join CYBEV today and start creating content, streaming live, and earning cryptocurrency rewards.',
    url: '/auth/signup'
  }
};
