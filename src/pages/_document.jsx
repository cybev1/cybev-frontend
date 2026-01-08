// ============================================
// FILE: src/pages/_document.jsx
// Optimized Document with Performance & SEO
// ============================================

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://api.cybev.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
        
        {/* Favicon & App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#7c3aed" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1f2937" media="(prefers-color-scheme: dark)" />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="CYBEV" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CYBEV" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Fonts - Preload critical font */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CYBEV',
              url: 'https://cybev.io',
              logo: 'https://cybev.io/logo.png',
              sameAs: [
                'https://twitter.com/cybev_io',
                'https://facebook.com/cybev',
                'https://instagram.com/cybev_io'
              ],
              description: 'The ultimate platform for creators. Write blogs, share posts, go live, earn tokens, and build your community.'
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'CYBEV',
              url: 'https://cybev.io',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://cybev.io/search?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        
        {/* Performance: Defer non-critical scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Register Service Worker
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
              
              // Prefetch on hover
              document.addEventListener('DOMContentLoaded', function() {
                document.querySelectorAll('a[href^="/"]').forEach(function(link) {
                  link.addEventListener('mouseenter', function() {
                    var href = this.getAttribute('href');
                    if (href && !document.querySelector('link[href="' + href + '"]')) {
                      var prefetch = document.createElement('link');
                      prefetch.rel = 'prefetch';
                      prefetch.href = href;
                      document.head.appendChild(prefetch);
                    }
                  });
                });
              });
            `
          }}
        />
      </body>
    </Html>
  );
}
