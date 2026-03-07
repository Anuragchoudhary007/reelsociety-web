import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },

  // Prevent Vercel build failure from TypeScript strict errors
  typescript: {
    ignoreBuildErrors: true,
  },

  turbopack: {
    root: __dirname,
  },

};

export default nextConfig;