/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.56.1', '10.136.197.215'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;