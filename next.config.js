// ============================================
// FILE: next.config.js
// Next.js Configuration with Performance Optimizations
// VERSION: 2.0
// ============================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for better debugging
  reactStrictMode: true,

  // Enable SWC minification (faster than Terser)
  swcMinify: true,

  // Optimize images
  images: {
    domains: [
      'res.cloudinary.com',
      'cloudinary.com',
      'images.unsplash.com',
      'ui-avatars.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'graph.facebook.com',
      'image.mux.com',
      'stream.mux.com',
      'cybev.io',
      'api.cybev.io'
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
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
      {
        // Security headers for all routes
        source: '/:path*',
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
        destination: '/api/sitemap.xml'
      },
      {
        source: '/@:username',
        destination: '/profile/:username'
      }
    ];
  },

  // Experimental features
  experimental: {
    // Enable optimized loading
    optimizePackageImports: [
      'lucide-react',
      '@heroicons/react',
      'date-fns',
      'lodash'
    ],
    // Scroll restoration
    scrollRestoration: true
  },

  // Webpack customization
  webpack: (config, { dev, isServer }) => {
    // Optimize production builds
    if (!dev && !isServer) {
      // Split chunks more aggressively
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1];
              return `vendor.${packageName?.replace('@', '')}`;
            }
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      };
    }

    // SVG as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },

  // Output configuration
  output: 'standalone',

  // Powered by header
  poweredByHeader: false,

  // Trailing slashes
  trailingSlash: false,

  // Disable x-powered-by
  generateEtags: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'CYBEV',
    NEXT_PUBLIC_APP_URL: 'https://cybev.io'
  }
};

module.exports = nextConfig;
