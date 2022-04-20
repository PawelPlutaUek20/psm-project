/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withPWA = require("next-pwa");
const runtimeCaching = require('next-pwa/cache')

module.exports = nextConfig;

module.exports = withPWA({
  pwa: {
    dest: "public",
    runtimeCaching,
  },
});
