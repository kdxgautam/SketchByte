import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains:['firebasestorage.googleapis.com',"assets.aceternity.com","pbs.twimg.com","images.unsplash.com"]
  }
};

export default nextConfig;
