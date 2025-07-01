
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('formidable');
    }
    return config;
  },
};
