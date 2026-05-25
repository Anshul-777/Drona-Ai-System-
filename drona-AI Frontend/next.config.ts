import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable SWR caching for API routes
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  // Environment-based optimization
  productionBrowserSourceMaps: false,
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Compression
  compress: true,
  // Powering streaming responses for AI chat
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
