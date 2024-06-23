/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.FREEPIK_BASE_URL,
      },
      {
        protocol: "https",
        hostname: process.env.S3_BUCKET_BASE_URL,
      },
    ],
  },
};

export default nextConfig;
