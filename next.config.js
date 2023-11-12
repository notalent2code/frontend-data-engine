/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'indigo-data-engine.s3.ap-southeast-3.amazonaws.com',
      }
    ]
  }
}

module.exports = nextConfig
