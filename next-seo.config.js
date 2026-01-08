// ============================================
// FILE: next-seo.config.js
// SEO Configuration for CYBEV
// Place in root of frontend project
// ============================================

const SEO = {
  titleTemplate: '%s | CYBEV',
  defaultTitle: 'CYBEV - Create, Connect, Inspire',
  description: 'CYBEV is the ultimate platform for creators. Write blogs, share posts, go live, earn tokens, and build your community. Join thousands of creators today.',
  canonical: 'https://cybev.io',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cybev.io',
    siteName: 'CYBEV',
    title: 'CYBEV - Create, Connect, Inspire',
    description: 'The ultimate platform for creators. Write, share, stream, and earn.',
    images: [
      {
        url: 'https://cybev.io/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CYBEV - Create, Connect, Inspire',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    handle: '@cybev_io',
    site: '@cybev_io',
    cardType: 'summary_large_image'
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5'
    },
    {
      name: 'theme-color',
      content: '#7c3aed'
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent'
    },
    {
      name: 'application-name',
      content: 'CYBEV'
    },
    {
      name: 'keywords',
      content: 'blog, social media, live streaming, creators, content creation, Web3, NFT, tokens, community'
    },
    {
      name: 'author',
      content: 'CYBEV'
    },
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    }
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico'
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180'
    },
    {
      rel: 'manifest',
      href: '/manifest.json'
    },
    {
      rel: 'preconnect',
      href: 'https://api.cybev.io'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'dns-prefetch',
      href: 'https://res.cloudinary.com'
    }
  ]
};

export default SEO;
