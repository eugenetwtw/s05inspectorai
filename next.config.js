/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_API_BASE_URL: process.env.OPENAI_API_BASE_URL,
  },
  // Set page extensions to only include App Router files
  pageExtensions: ['tsx', 'ts'],
  // Add Supabase Storage and Blob storage domains to image domains
  images: {
    domains: [
      'yxzgfzz1qmz8m8cf.public.blob.vercel-storage.com',
      'supabase.co',
      'supabase.in'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/storage/v1/object/public/**',
      }
    ]
  },
  // App Router is enabled by default in Next.js 13.4+
  // experimental: {
  //   appDir: true,
  // },
  
  // Internationalization configuration
  // We're handling i18n manually with URL parameters and context
  // This is just to inform Next.js about our supported locales
  i18n: {
    // These are all the locales you want to support
    locales: ['zh-TW', 'zh-CN', 'en'],
    // The default locale is used when visiting a non-locale prefixed path
    defaultLocale: 'zh-TW',
    // We're not using the built-in locale detection, we're doing it manually
    localeDetection: false,
  },
}

module.exports = nextConfig
