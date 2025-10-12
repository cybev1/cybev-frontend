/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,

  // ✅ Proxy any frontend call to /api/* → your backend API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE}/api/:path*`,
      },
    ];
  },

  // ✅ Keep your current webpack customization (formidable external on server)
  // ➕ Add browser polyfills so ipfs-http-client bundles on Next 13
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        crypto: require.resolve('crypto-browserify'),
        process: require.resolve('process/browser')
      };
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: ['process']
        })
      );
    }

    // Ensure externals array exists before pushing
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('formidable');
    }

    return config;
  },
};

module.exports = nextConfig;
