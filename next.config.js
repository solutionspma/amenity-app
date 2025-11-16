/** @type {import('next').NextConfig} */
const nextConfig = {
  // Conditional output based on build vs dev
  ...(process.env.NODE_ENV === 'production' && process.env.BUILD_STATIC === 'true' ? {
    output: 'export',
    trailingSlash: true,
  } : {}),
  images: {
    domains: [
      'via.placeholder.com',
      'supabase.co',
      'amenityapp.com',
      'youtube.com',
      'ytimg.com',
      'vimeo.com',
      'twitch.tv',
    ],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    FFMPEG_SERVER_URL: process.env.FFMPEG_SERVER_URL,
    WEBRTC_SERVER_URL: process.env.WEBRTC_SERVER_URL,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/video/:path*',
        destination: '/api/video/:path*',
      },
      {
        source: '/stream/:path*',
        destination: '/api/stream/:path*',
      },
    ];
  },
};

module.exports = nextConfig;