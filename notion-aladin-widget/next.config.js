/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.aladin.co.kr" },
      { protocol: "http", hostname: "image.aladin.co.kr" }
    ]
  }
};

module.exports = nextConfig;
