/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: true,
  transpilePackages: ['@shio/core'],
};

export default config;
