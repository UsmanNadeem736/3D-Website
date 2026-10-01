import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js ships modern ESM; transpiling keeps older browsers happy.
  transpilePackages: ["three"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }],
  },
};

export default nextConfig;
