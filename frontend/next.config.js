/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel дээр static export хэрэггүй
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
