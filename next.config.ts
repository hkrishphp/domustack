import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "prodhlwozmblujplrcri.supabase.co",
      },
      {
        protocol: "https",
        hostname: "ylureiplzsqdeyswmyud.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "d9hhrg4mnvzow.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
