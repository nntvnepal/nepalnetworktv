/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },

  staticPageGenerationTimeout: 0,
};

module.exports = nextConfig;