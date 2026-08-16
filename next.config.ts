import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Küchenheld's photography still lives on the Webflow CDN. Once the assets
    // move to the production CMS/DAM these patterns are the only thing to swap.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/6391b8b8063c7487769d5e4c/**",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/6391b8b8063c74b54a9d5e71/**",
      },
    ],
  },
};

export default nextConfig;
