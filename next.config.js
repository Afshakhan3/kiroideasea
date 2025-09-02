/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['supabase.co'],
  },
  output: 'standalone',
  trailingSlash: true,
}

module.exports = nextConfig