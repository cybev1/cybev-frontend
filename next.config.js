/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,

  // Proxy /api/* → your backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE}/api/:path*`,
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Polyfills/fallbacks for browser bundles (ipfs-http-client, ethers, etc.)
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        crypto: require.resolve('crypto-browserify'),
        process: require.resolve('process/browser'),
        // Silence “Module not found” for Node-only modules in client
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

    // Keep formidable server-only
    config.externals = config.externals || [];
    if (isServer) config.externals.push('formidable');

    return config;
  },
};

module.exports = nextConfig;
