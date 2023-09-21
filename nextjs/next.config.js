/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals = [
      ...config.externals,
      'hnswlib-node',
      {
        chromadb: 'chromadb',
      },
    ];
    return config;
  },
};

module.exports = nextConfig;
