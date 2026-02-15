/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@playverse/shared'],
  images: {
    domains: ['localhost'],
  },
  output: 'standalone',
};

module.exports = nextConfig;
