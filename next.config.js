// ============================================
// FILE: next.config.js
// Optimized Next.js Configuration
// UPDATED: v1.2.0 - Fixed Meet camera/mic permissions
// ============================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development
  reactStrictMode: true,
  
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  
  // Compress responses
  compress: true,
  
  // Generate ETags for caching
  generateEtags: true,
  
  // Powered by header (disable for security)
  poweredByHeader: false,
  
  // Trailing slashes
  trailingSlash: false,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
        pathname: '/**'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  // Experimental features - removed unsupported options for Next.js 13.4
  experimental: {
    scrollRestoration: true
  },
  
  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },
  
  // Headers for caching and security
  async headers() {
    return [
      // ============================================
      // MEET PAGES - Allow Jitsi iframe camera/mic
      // MUST have permissive policy for video conferencing
      // ============================================
      {
        source: '/meet/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=*, fullscreen=*, display-capture=*, autoplay=*'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
          // NOTE: NO X-Frame-Options here - Jitsi needs to embed
        ]
      },
      // ============================================
      // STATIC ASSETS - Long cache
      // ============================================
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // ============================================
      // ALL OTHER PAGES (except /meet) - Security headers
      // Using regex to EXCLUDE meet pages
      // ============================================
      {
        source: '/((?!meet).*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=(self)'
          }
        ]
      }
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true
      },
      {
        source: '/signup',
        destination: '/auth/signup',
        permanent: true
      },
      {
        source: '/register',
        destination: '/auth/signup',
        permanent: true
      }
    ];
  },
  
  // Rewrites for cleaner URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      },
      {
        source: '/robots.txt',
        destination: '/api/robots'
      },
      {
        source: '/u/:username',
        destination: '/profile/:username'
      },
      {
        source: '/b/:id',
        destination: '/blog/:id'
      },
      {
        source: '/s/:streamId',
        destination: '/live/:streamId'
      }
    ];
  },
  
  // Webpack customization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true
          },
          lib: {
            test(module) {
              return module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier());
            },
            name(module) {
              const hash = require('crypto')
                .createHash('sha1')
                .update(module.identifier())
                .digest('hex')
                .substring(0, 8);
              return `lib-${hash}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20
          },
          shared: {
            name(module, chunks) {
              return `shared-${chunks.map(c => c.name).join('-')}`;
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true
          }
        }
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;
