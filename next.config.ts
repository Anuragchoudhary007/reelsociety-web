import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"image.tmdb.org"
      },
      {
        protocol:"https",
        hostname:"api.dicebear.com"
      },
      {
        protocol:"https",
        hostname:"firebasestorage.googleapis.com"
      }
    ]
  },

  turbopack:{
    root:__dirname
  }

}

export default nextConfig