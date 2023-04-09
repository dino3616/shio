/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    appDir: true,
    fontLoaders: [{ loader: '@next/font/google', options: { subsets: ['latin'] } }],
  },
  reactStrictMode: true,
};
