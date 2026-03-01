// import type { NextConfig } from "next"

// const nextConfig: NextConfig = {
//   turbopack: {
//     root: __dirname,
//   },
// }

// export default nextConfig
const nextConfig = {
  images: {
    domains: ["image.tmdb.org"],
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig