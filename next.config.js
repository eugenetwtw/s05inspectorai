/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_API_BASE_URL: process.env.OPENAI_API_BASE_URL,
  },
  // Set page extensions to only include App Router files
  pageExtensions: ['tsx', 'ts'],
  // Add Blob storage domain to image domains
  images: {
    domains: ['yxzgfzz1qmz8m8cf.public.blob.vercel-storage.com'],
  },
  // App Router is enabled by default in Next.js 13.4+
  // experimental: {
  //   appDir: true,
  // },
}

module.exports = nextConfig
