import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "72.62.31.233",
        port: "4000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      }, 
    ],
  },
  // Transpile workspace packages
  transpilePackages: ["@repo/ui", "@repo/types"],
};

export default nextConfig;
