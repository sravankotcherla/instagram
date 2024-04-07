/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "**",
        pathname: "/a/ACg8ocLsn2msZDCTrbmLJl5_u7RyAQZu40lb4nJA01vKXPS5=s96-c",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
