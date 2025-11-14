/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  
  typescript: { 
    ignoreBuildErrors: true 
  },
  
  eslint: { 
    ignoreDuringBuilds: true 
  },

  // ✨ Enhanced image domains for AI Template Generator
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'source.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
    // Optimized for mobile and desktop
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'], // Better compression for mobile
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        crypto: require.resolve('crypto-browserify'),
        process: require.resolve('process/browser'),
        fs: false,
        path: false,
        os: false,
        zlib: false,
        http: false,
        https: false,
        net: false,
        tls: false,
      };
      
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: ['process'],
        })
      );
    }

    if (isServer) {
      config.externals.push('formidable');
    }

    return config;
  },
};

module.exports = nextConfig;
