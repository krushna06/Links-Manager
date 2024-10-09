/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_USERNAME: process.env.USERNAME,
    NEXT_PUBLIC_PASSWORD: process.env.PASSWORD,
  },
  reactStrictMode: true,
};

export default nextConfig;
