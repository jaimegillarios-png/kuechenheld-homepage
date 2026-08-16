import type { NextConfig } from "next";

// Static hosting (GitHub Pages and friends) has no image optimizer and serves
// project sites from a subpath. Both are opt-in so the default build stays a
// full Next.js deployment with next/image intact.
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(staticExport ? { output: "export" as const } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // Exposed so `asset()` can prefix /public paths in the browser too.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    unoptimized: staticExport,
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
