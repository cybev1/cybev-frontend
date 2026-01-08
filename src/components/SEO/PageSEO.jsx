// ============================================
// FILE: src/components/SEO/PageSEO.jsx
// Dynamic SEO Component for Pages
// ============================================

import Head from 'next/head';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cybev.io';
const SITE_NAME = 'CYBEV';

export default function PageSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  noindex = false
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const pageDescription = description || 'The ultimate platform for creators. Write blogs, share posts, go live, earn tokens, and build your community.';
  const pageImage = image || `${SITE_URL}/og-image.png`;
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Head>
      {/* Basic Meta */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title || SITE_NAME} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {tags.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cybev_io" />
      <meta name="twitter:title" content={title || SITE_NAME} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* Additional */}
      <meta name="theme-color" content="#7c3aed" />
    </Head>
  );
}

// Blog-specific SEO
export function BlogSEO({ blog, url }) {
  if (!blog) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.content?.substring(0, 160),
    image: blog.featuredImage || `${SITE_URL}/og-image.png`,
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'CYBEV User',
      url: blog.author?.username ? `${SITE_URL}/profile/${blog.author.username}` : undefined
    },
    publisher: {
      '@type': 'Organization',
      name: 'CYBEV',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${url}`
    },
    wordCount: blog.content?.split(/\s+/).length || 0,
    keywords: blog.tags?.join(', ') || ''
  };

  return (
    <>
      <PageSEO
        title={blog.title}
        description={blog.excerpt || blog.content?.substring(0, 160)}
        image={blog.featuredImage}
        url={url}
        type="article"
        publishedTime={blog.createdAt}
        modifiedTime={blog.updatedAt}
        author={blog.author?.name}
        tags={blog.tags || []}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
    </>
  );
}

// Profile-specific SEO
export function ProfileSEO({ user, url }) {
  if (!user) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: user.name,
      alternateName: user.username,
      description: user.bio,
      image: user.avatar,
      url: `${SITE_URL}${url}`,
      sameAs: user.socialLinks || []
    }
  };

  return (
    <>
      <PageSEO
        title={`${user.name} (@${user.username})`}
        description={user.bio || `Check out ${user.name}'s profile on CYBEV`}
        image={user.avatar}
        url={url}
        type="profile"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
    </>
  );
}

// Live Stream SEO
export function LiveStreamSEO({ stream, url }) {
  if (!stream) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: stream.title,
    description: stream.description || `Live stream by ${stream.host?.name}`,
    thumbnailUrl: stream.thumbnail || `${SITE_URL}/live-thumbnail.png`,
    uploadDate: stream.createdAt,
    publication: {
      '@type': 'BroadcastEvent',
      isLiveBroadcast: stream.status === 'live',
      startDate: stream.startedAt
    },
    contentUrl: `${SITE_URL}${url}`
  };

  return (
    <>
      <PageSEO
        title={stream.status === 'live' ? `🔴 ${stream.title}` : stream.title}
        description={stream.description || `Watch ${stream.host?.name}'s stream on CYBEV`}
        image={stream.thumbnail}
        url={url}
        type="video.other"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
    </>
  );
}
