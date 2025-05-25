/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignore TypeScript errors during production builds
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
