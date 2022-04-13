/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "s.gravatar.com"],
  },
  presets: ["next/babel"],
};

module.exports = nextConfig;
