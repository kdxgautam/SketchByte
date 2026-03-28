import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images:{
    domains:['firebasestorage.googleapis.com',"assets.aceternity.com","pbs.twimg.com","images.unsplash.com"]
  },
};

export default nextConfig;
