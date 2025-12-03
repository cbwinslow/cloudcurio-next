import { withContentlayer } from 'contentlayer/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' }
    ]
  },
  webpack: (config) => config
};

export default withContentlayer(nextConfig);