import Head from 'next/head';
import { useRouter } from 'next/router';

export default function SEO({
  title = 'CYBEV - Create, Connect, Own Everything',
  description = 'Build your blog, join the social network, mint NFTs, and earn crypto. All powered by AI.',
  image = '/og-image.png',
  type = 'website',
  keywords = 'blog platform, web3, nft, crypto, content creation, blogging, social network',
  author = 'CYBEV',
  publishedTime,
  modifiedTime,
  canonicalUrl
}) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cybev.io';
  const fullUrl = canonicalUrl || `${siteUrl}${router.asPath}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Clean title for display
  const pageTitle = title.includes('CYBEV') ? title : `${title} | CYBEV`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#7C3AED" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="CYBEV" />
      <meta property="og:locale" content="en_US" />

      {/* Article specific tags */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          <meta property="article:author" content={author} />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@cybev_io" />
      <meta name="twitter:site" content="@cybev_io" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'WebSite',
            name: pageTitle,
            description: description,
            url: fullUrl,
            image: imageUrl,
            ...(type === 'article' && {
              author: {
                '@type': 'Person',
                name: author
              },
              datePublished: publishedTime,
              dateModified: modifiedTime
            })
          })
        }}
      />
    </Head>
  );
}
