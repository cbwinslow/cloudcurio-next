/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { ppr: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' }
    ]
  },
  webpack: (config) => config
};
export default nextConfig;
