/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,

  // Proxy /api/* → your backend API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE}/api/:path*`,
      },
    ];
  },

  // TEMP: don't block builds on TS or ESLint while we stabilize
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  webpack: (config, { isServer }) => {
    // Browser fallbacks for ipfs-http-client / ethers, etc.
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
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
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: ['process'],
        })
      );
    }

    // Keep 'formidable' server-only
    config.externals = config.externals || [];
    if (isServer) config.externals.push('formidable');

    return config;
  },

  // Image domains
  images: {
    domains: [
      'localhost',
      'cybev.io',
      'railway.app',
      'vercel.app'
    ],
  },
};

module.exports = nextConfig;
