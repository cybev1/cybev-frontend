// next.config.js
/** @type {import('next').NextConfig} */
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
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('formidable');
    }
    return config;
  },
};

module.exports = nextConfig;
