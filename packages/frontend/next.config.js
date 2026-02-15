/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@playverse/shared'],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
