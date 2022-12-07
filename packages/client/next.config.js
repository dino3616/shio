const removeImports = require('next-remove-imports');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
};

module.exports = removeImports()(nextConfig);
